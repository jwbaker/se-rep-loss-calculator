import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateRange } from "../models/date-range";
import { StackExchangeService } from "../stack-exchange.service";
import { SeReputationHistory, SeReputationHistoryType } from "../models/se-reputation-history";
import { AlertableDirective } from "../alertable/alertable.directive";
import { AlertManagerService } from "../alert-manager.service";
import { SePostType } from "../models/se-post";

interface ReputationDiscrepancy {
  earnedReputation:number;
  expectedReputation:number;
  reputationHistoryType:SeReputationHistoryType;
  postId?:Number;
}

@Component({
  selector: 'app-se-loss-table',
  templateUrl: './se-loss-table.component.html',
  styleUrls: ['./se-loss-table.component.css']
})
export class SeLossTableComponent extends AlertableDirective implements OnChanges {

  private static knownReputationEventEffects = new Map<SeReputationHistoryType, number>([
    [SeReputationHistoryType.asker_accepts_answer, 2],
    [SeReputationHistoryType.asker_unaccept_answer, -2],
    [SeReputationHistoryType.answer_accepted, 15],
    [SeReputationHistoryType.answer_unaccepted, -15],
    [SeReputationHistoryType.voter_downvotes, -1],
    [SeReputationHistoryType.voter_undownvotes, 1],
    [SeReputationHistoryType.post_downvoted, -2],
    [SeReputationHistoryType.post_undownvoted, 2],
    [SeReputationHistoryType.suggested_edit_approval_received, 2],
    [SeReputationHistoryType.post_flagged_as_spam, -100],
    [SeReputationHistoryType.post_flagged_as_offensive, -100],
    [SeReputationHistoryType.association_bonus, 100]
  ]);

  private static messages = {
    'working': 'Working...'
  }

  @Input() userId:Number;
  @Input() site:String;
  @Input() accessToken:String;
  @Input() dateRange:DateRange;
  @Input() beginCalculation:boolean;

  private working = false;
  private message:string;
  private reputationEvents:ReputationDiscrepancy[];
  private reputationCounter:{
    earnedReputation,
    expectedReputation,
    earnedSuggestedEditReputation,
    expectedSuggestedEditReputation
  };

  private postsForInspection:Map<number, SeReputationHistory[]>;

  constructor(private se:StackExchangeService, protected alertManager: AlertManagerService) { 
    super(alertManager);
    this.resetCalculation();
   }

  private resetCalculation() {
    this.working = false;
    this.reputationCounter = {
      earnedReputation: 1,
      expectedReputation: 1,
      earnedSuggestedEditReputation: 0,
      expectedSuggestedEditReputation: 0
    };
    this.reputationEvents = [];
    this.postsForInspection = new Map<number, SeReputationHistory[]>();
}

  ngOnChanges(changes: SimpleChanges): void {
    const beginCalculationChanged = changes.beginCalculation;
    if(beginCalculationChanged && beginCalculationChanged.currentValue && beginCalculationChanged.currentValue !== beginCalculationChanged.previousValue){
      this.resetCalculation();
      this.doCalculate();
    }
  }

  private doCalculate() {
    this.working = true;
    this.message = SeLossTableComponent.messages.working;

    let subscription = this.se.getReputationHistory(this.userId, this.site, this.accessToken, this.dateRange).subscribe({
      next: event => this.processReputationEvent(event),
      error: message => {
        this.raise("danger", message, {});
        subscription.unsubscribe();
        this.working = false;
      },
      complete: () => {
        this.reputationCounter.earnedReputation += this.reputationCounter.earnedSuggestedEditReputation;
        this.reputationCounter.expectedReputation += this.reputationCounter.expectedSuggestedEditReputation;
        this.processPosts();
      }
    });
  }

  private processReputationEvent(reputationEvent:SeReputationHistory){
    const repHistoryType = reputationEvent.reputationHistoryType;
    let push = true;
    switch(repHistoryType){
      case SeReputationHistoryType.suggested_edit_approval_overridden:
        const mult = -1;
      case SeReputationHistoryType.suggested_edit_approval_received:
        this.reputationCounter.earnedSuggestedEditReputation = Math.min(
          this.reputationCounter.earnedSuggestedEditReputation + reputationEvent.reputationChange,
          1000
        );
        this.reputationCounter.expectedSuggestedEditReputation = Math.min(
          this.reputationCounter.expectedSuggestedEditReputation + (mult || 1)*reputationEvent.reputationChange,
          1000
        );
        break;
      case SeReputationHistoryType.asker_accepts_answer:
      case SeReputationHistoryType.asker_unaccept_answer:
      case SeReputationHistoryType.answer_accepted:
      case SeReputationHistoryType.answer_unaccepted:
      case SeReputationHistoryType.post_upvoted:
      case SeReputationHistoryType.post_unupvoted:
        if(!reputationEvent.postId){
          this.raise("danger", "No post id found for reputation event type " + repHistoryType, {});
          throw "No post id found for reputation event type " + repHistoryType;
        }
        if(!this.postsForInspection.has(reputationEvent.postId)){
          this.postsForInspection.set(reputationEvent.postId, [reputationEvent]);
        } else {
          this.postsForInspection.set(
            reputationEvent.postId, 
            this.postsForInspection.get(reputationEvent.postId).concat([reputationEvent])
          );
        }
        push = false;
        break;
      default:
        this.reputationCounter.earnedReputation += reputationEvent.reputationChange;
        this.reputationCounter.expectedReputation += SeLossTableComponent.knownReputationEventEffects.get(repHistoryType) 
                                                      || reputationEvent.reputationChange;
    }
    push && this.reputationEvents.push({
      earnedReputation: reputationEvent.reputationChange,
      expectedReputation: 0,
      reputationHistoryType: reputationEvent.reputationHistoryType,
      postId: reputationEvent.postId
    });
  }

  private processPosts(){
    const pageSize = 100;
    const postIds = Array.from(this.postsForInspection.keys());
    for(let i = 0; i < postIds.length; i += pageSize) {
      const requestIds = postIds.slice(i, i+pageSize);
      let subscription = this.se.getPosts(requestIds, this.site, this.accessToken).subscribe({
        next: (event) => {
          for(let repEvent of this.postsForInspection.get(event.postId)){
            const repHistoryType = repEvent.reputationHistoryType;
            let earnedRep;
            let expectedRep;
            switch(repHistoryType){
              case SeReputationHistoryType.asker_accepts_answer:
              case SeReputationHistoryType.asker_unaccept_answer:
              case SeReputationHistoryType.answer_accepted:
              case SeReputationHistoryType.answer_unaccepted:
                if(event.owner.userId === this.userId){
                  earnedRep = 0;
                  expectedRep = 0;
                } else{
                  earnedRep = repEvent.reputationChange;
                  expectedRep = repEvent.reputationChange;
                }
                break;
              case SeReputationHistoryType.post_unupvoted:
                const mult = -1;
              case SeReputationHistoryType.post_upvoted:
                console.log(event);
                earnedRep = repEvent.reputationChange;
                switch(event.postType){
                  case SePostType.answer:
                    expectedRep = 10;
                    break;
                  case SePostType.question:
                    expectedRep = 5;
                    break;
                }
                expectedRep *= (mult || 1);
            }
            this.reputationCounter.earnedReputation += earnedRep;
            this.reputationCounter.expectedReputation += expectedRep;
            this.reputationEvents.push({
              earnedReputation: earnedRep,
              expectedReputation: expectedRep,
              reputationHistoryType: repHistoryType,
              postId: repEvent.postId
            });
          }
        },
        error: message => {
          this.raise("danger", message, {});
          subscription.unsubscribe();
          this.working = false;
        },
        complete: () => {
          this.working = false;
        }
      });
    }
  }

}
