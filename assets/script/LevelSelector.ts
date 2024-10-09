import { _decorator, Component, director, Node } from 'cc';
import { SceneNames } from './EnumDefine';
const { ccclass, property } = _decorator;

@ccclass('LevelSelector')
export class LevelSelector extends Component {
    
    levelIndex = 0;

    selectLevel(customData, lvl) {
        if(window.Global.levelData != null) {
            window.Global.sceneNumber = this.levelIndex;
            director.loadScene(SceneNames.GameScene);
        }
    }
}


