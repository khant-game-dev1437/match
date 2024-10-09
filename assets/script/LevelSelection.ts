import { _decorator, Component, director, JsonAsset, Node, resources, Scene } from 'cc';
import { SceneNames } from './EnumDefine';
const { ccclass, property } = _decorator;

@ccclass('LevelSelection')
export class LevelSelection extends Component {
   
   

    protected onLoad(): void {
        // Define the Global object if it does not already exist
        window.Global = window.Global || {
            levelData: null,
            sceneNumber: 0
        };
        
        // Load the JSON asset
        resources.load('Levels', JsonAsset, (err, jsonAsset) => {
            if (err) {
               
                return;
            }
            window.Global.levelData = jsonAsset.json;
        });
    }
    

    selectLevel(customData, lvl) {
        if(window.Global.levelData != null) {
            window.Global.sceneNumber = Number(lvl);
            director.loadScene(SceneNames.GameScene);
        }
    }
}


