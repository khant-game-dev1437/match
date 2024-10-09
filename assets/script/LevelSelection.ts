import { _decorator, Component, director, Node } from 'cc';
import { SceneNames } from './EnumDefine';
const { ccclass, property } = _decorator;

@ccclass('LevelSelection')
export class LevelSelection extends Component {
   
    
    selectLevel(customData, lvl) {
        director.loadScene(`${SceneNames.Scene}${lvl}`);
    }
}


