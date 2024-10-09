import { _decorator, Button, Component, director, instantiate, JsonAsset, Label, Node, Prefab, resources, Scene } from 'cc';
import { SceneNames } from './EnumDefine';
import { LevelSelector } from './LevelSelector';
const { ccclass, property } = _decorator;

@ccclass('LevelSelection')
export class LevelSelection extends Component {
   
    @property(Prefab)
    levelPrefab = null;
    
    @property(Node)
    levelContent = null;

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

            this.createLevelMenu();
        });
    }
    

    createLevelMenu() {
        const levelCounts = window.Global.levelData.grid.length;
        
        for(let i = 0; i < levelCounts; i++) {
            const levelObj = instantiate(this.levelPrefab);
            levelObj.getComponent(LevelSelector).levelIndex = i
            levelObj.getChildByName('Label').getComponent(Label).string = i + 1;
            this.levelContent.addChild(levelObj);

            console.log('customdaaaa ', levelObj.getComponent(Button).customData)
        }   
    }
}


