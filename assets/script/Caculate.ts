import { _decorator, AudioSource, Component, director, instantiate, Label, Sprite } from 'cc';
import { Events } from './MessageEvent.ts/Events';
import { Message } from './MessageManager';
import { CardProperty } from './CardProperty';
import { GridInitialize } from './GridInitialize';

const { ccclass, property } = _decorator;

@ccclass('Caculate')
export class Caculate extends Component {

    @property(Label)
    public scoreLabel = null;

    @property(Label)
    public turnCountLabel = null;

    @property(Label)
    public sceneLabel = null;

    @property
    public sceneNumber = 0;

    @property(AudioSource)
    public audioSource = null;

    suitList = [];
    cardList = [];

    totalScore = 0;
    turnCount = 0;

    saveNodeNames = [];
    saveNodePos = [];


    protected onLoad(): void {
        this.sceneLabel.string = String(`Scene ${this.sceneNumber}`);
    }

    start() {
        Message.on(Events.CARD_CACULATE, this.caculateCard, this);
    }

    protected onDestroy(): void {
        Message.off(Events.CARD_CACULATE, this.caculateCard, this);
    }

    caculateCard(event, data) {
        
        this.suitList.push(data[0]);
        this.cardList.push(data[1]);

        if (this.suitList.length == 2) {
            if (this.suitList[0] === this.suitList[1]) { // if first suit and second suit equal
                this.audioSource.play();
                this.totalScore++;
                this.scoreLabel.string = `Score: ${this.totalScore}`;

                const destroyCards = new Promise<void>((resolve) => {
                    this.cardList.forEach(e => {
                        e.destroy();
                    });
                    
                    this.suitList = [];
                    this.cardList = [];
                    
                    this.scheduleOnce(() => {
                        resolve();
                    }, 0);
                });
                
                destroyCards.then(() => {
                    this.scheduleOnce(()=> { // To prevent immediate scene change, Let user knows that he wins
                        if (this.node.getComponent(GridInitialize).cardParent.children.length <= 0) {
                            if (this.sceneNumber >= 3) {
                                const ts = this.node.getComponent(GridInitialize);
                                ts.lbl_systemInfo.string = 'GAME OVER'
                                return;
                            }
                            director.loadScene(`Scene${this.sceneNumber + 1}`);
                        }
                    }, 1)
                });                
                    
            } else {
                // Set to its original scale
                this.cardList.forEach(e => {
                    e.getComponent(CardProperty).invertCard();
                });

                this.suitList = [];
                this.cardList = [];
            }
            this.turnCount++;
            this.turnCountLabel.string = `Turn Counts: ${this.turnCount}`;
        }
    }

    restartCurrentScene() {
        director.loadScene(`Scene${this.sceneNumber}`);
    }

    saveData() {
        this.saveNodeNames = [];
        this.saveNodePos = [];

        const ts = this.node.getComponent(GridInitialize);
        for(let i = 0; i < ts.cardParent.children.length; i++) {
            this.saveNodeNames.push(Number(ts.cardParent.children[i].getComponent(CardProperty).suit));
            const childPos = ts.cardParent.children[i].position;
            this.saveNodePos.push({x: childPos.x, y: childPos.y});
        }
        localStorage.setItem('NodeNames', JSON.stringify(this.saveNodeNames));
        localStorage.setItem('NodePos', JSON.stringify(this.saveNodePos));
        localStorage.setItem('SceneNum', JSON.stringify(this.sceneNumber));
        localStorage.setItem('CardParentPos', JSON.stringify(ts.cardParent.position));
        localStorage.setItem('Counts', JSON.stringify({scorePoint: this.totalScore, turningCount: this.turnCount}))
    }

    loadData() {

        
        const ts = this.node.getComponent(GridInitialize);

        let loadSceneNum = JSON.parse(localStorage.getItem('SceneNum'));
        
        if(loadSceneNum == '' || loadSceneNum == null || loadSceneNum == undefined) {
            ts.lbl_systemInfo.string = 'NO DATA TO LOAD';
            return;
        }

        this.sceneNumber = loadSceneNum;
        this.sceneLabel.string = String(`Scene ${this.sceneNumber}`);

        const destroyCards = new Promise<void>((resolve) => {
            ts.cardParent.destroyAllChildren();
            
            this.totalScore = 0;
            this.turnCount = 0;
    
            this.saveNodeNames = [];
            this.saveNodePos = [];
            this.suitList = [];
            this.cardList = [];

            this.scheduleOnce(() => {
                resolve();
            }, 0);
        });
         
        
        destroyCards.then(()=> {

            let loadNodeNames = JSON.parse(localStorage.getItem('NodeNames'));
            let loadNodePos = JSON.parse(localStorage.getItem('NodePos'));
            let loadCardParentPos = JSON.parse(localStorage.getItem('CardParentPos'));
            let loadCounts = JSON.parse(localStorage.getItem('Counts'));

            if(loadNodeNames.length == null || loadNodePos.length == null || loadCardParentPos == null || loadCounts == null) {
                ts.lbl_systemInfo.string = 'NO DATA TO LOAD';
                return;
            }

            const { scorePoint, turningCount } = loadCounts;
            this.totalScore = scorePoint;
            this.turnCount = turningCount;

            const cardPrefab = ts.card;
            
            for(let i = 0; i < loadNodeNames.length; i++) {
                const cardObj = instantiate(cardPrefab);
                ts.cardParent.addChild(cardObj);
                cardObj.getComponent(Sprite).spriteFrame = cardObj.getComponent(CardProperty).backImg;
                cardObj.getComponent(CardProperty).suit = Number(loadNodeNames[i]);
                cardObj.getComponent(CardProperty).frontImg = null;
                cardObj.getComponent(CardProperty).invertCard();
                cardObj.setPosition(loadNodePos[i].x, loadNodePos[i].y);
            }

            this.scoreLabel.string = `Score: ${this.totalScore}`;
            this.turnCountLabel.string = `Turn Counts: ${this.turnCount}`;
            ts.cardParent.position = loadCardParentPos; // To make cards in center
        })
    }
}


