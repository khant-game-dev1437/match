import { _decorator, Component, instantiate, Label, Node, Prefab, UITransform } from 'cc';
import { CardProperty } from './CardProperty';
import { Caculate } from './Caculate';
const { ccclass, property } = _decorator;

@ccclass('GridInitialize')
export class GridInitialize extends Component {

    @property
    public rows: number = 0;

    @property
    public columns: number = 0;

    @property(Prefab)
    public card = null;

    @property(Node)
    public cardParent = null;

    @property(Label)
    public lbl_systemInfo = null;
    
    startX = 0;
    startY = 0;
    
    start() {
        if((this.rows * this.columns) % 2 != 0) {
            this.lbl_systemInfo.string = 'INVALID GRID SIZE';
            return;
        } else {
            this.lbl_systemInfo.string = '';
        }
        this.createGridLayout();
    }

    createGridLayout() {
        const pairs = this.generatePairs(this.rows, this.columns);
        const shuffledGridPairs = this.shuffleArray(pairs);
        let originalCardWidth = 0;
        let originalCardHeight = 0;
       
        // Assign pairs to cards and create grid
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const randomIndex = i * this.columns + j;
                const suit = shuffledGridPairs[randomIndex];

                // Instantiate card
                const card = instantiate(this.card);

                card.getComponent(CardProperty).suit = suit;
                card.getComponent(CardProperty).createCardImage();

                // Calculate position
                const cardWidth = card.getComponent(UITransform).width;
                const cardHeight = card.getComponent(UITransform).height;
                
                originalCardWidth = cardWidth;
                originalCardHeight = cardHeight;

                const posX = this.startX + j * (cardWidth + 2);
                const posY = this.startY - i * (cardHeight + 2);

                // Set position and add to parent
                card.setPosition(posX, posY);
                this.cardParent.addChild(card);
                
            }
        }
        // Set parent to the center
        this.cardParent.setPosition(originalCardWidth * (this.columns / 2 * -1 + 0.5) , originalCardHeight * (this.rows / 2 - 0.5)  )
    }

    // Generating pairs ratio equally to avoid bug
    generatePairs(rows, columns) {
        let totalPairs = (rows * columns) / 2;
        let pairs = [];
    
        for (let i = 1; i <= totalPairs; i++) {
            pairs.push(i);
            pairs.push(i);
        }
    
        // Shuffle the pairs
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }
    
        pairs = pairs.map(pair => (pair % 5) + 1);
    
        return pairs;
    }
    
    

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
