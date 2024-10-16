import { _decorator, AudioSource, Button, Component, Node, resources, Sprite, SpriteFrame, tween, Vec3, } from 'cc';
import { Message } from './MessageManager';
import { Events } from './MessageEvent/Events';

const { ccclass, property } = _decorator;

@ccclass('CardProperty')
export class CardProperty extends Component {

    public suit = 0;

    @property(SpriteFrame)
    backImg = null;

    @property(SpriteFrame)
    frontImg = null;

    @property(AudioSource)
    public audioSource = null;

    start() {
        this.createCardImage();
        this.node.setScale(-1,1,1);
    }

    createCardImage() {
        const self = this;
        resources.load(`sprite/${this.suit}/spriteFrame`, SpriteFrame, (err, res) => {
            if(err) { 
                return;
            };
            self.frontImg = res;
        })
    }

    flipCard() {
        this.audioSource.play();
        let tweenDuration: number = 0.1;    
        tween(this.node)
        .to(tweenDuration, {
            scale: new Vec3(1, 1, 1)
        },
        {
                easing: 'linear',
                onUpdate: (target: Node) => {
                    if (target.getScale().x >= 0) {
                        this.node.getComponent(Sprite).spriteFrame = this.frontImg;
                    }
                },
                onComplete: () => {
                    this.scheduleOnce(() => {  // Use setTimeout to prevent immediate match (for user experience)
                        Message.dispatchEvent(Events.CARD_CACULATE, [this.suit ,this.node]);    
                    }, 1);
                }
        })
        .start()
        this.node.getComponent(Button).interactable = false;
    }

    invertCard() {
        let tweenDuration: number = 0.1;    
        tween(this.node)
        .to(tweenDuration, {
            scale: new Vec3(-1, 1, 1)
        },
        {
                easing: 'linear',
                onUpdate: (target: Node, ratio) => {
                    if (target.getScale().x <= 0) {
                        this.node.getComponent(Sprite).spriteFrame = this.backImg;
                    }
                },
                onComplete: () => {
                   this.node.getComponent(Button).interactable = true;
                }
        })
        .start()
    }
}


