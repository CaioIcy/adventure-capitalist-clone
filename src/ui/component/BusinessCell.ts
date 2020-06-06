import { Container, Text, Sprite } from 'pixi.js';
import { TextureUtil } from '../../util/TextureUtil';

// states: Locked vs Unlocked
// Locked: purchaseable or not
// Unlocked:
//     InfoCell -- tap action & upgrade status & level
//     ProfitBar
//     UpgradeButton
//     TimeCell
//     ManagerCell
export class BusinessCell extends Container {
    private image: Sprite;
    private text: Text;

    public constructor() {
        super();

        this.width = 560;
        this.height = 130;

        const debugBackground = new Sprite(TextureUtil.createTexture('#FF0000'));
        debugBackground.width = this.width;
        debugBackground.height = this.height;
        this.addChild(debugBackground);

        this.image = new Sprite(TextureUtil.createTexture('#FFFFFF'));
        this.image.width = 128;
        this.image.height = 128;
        this.addChild(this.image);
        this.image.x = this.x;

        this.text = new Text('01/25');
        this.addChild(this.text);
    }

    public setup(): void {
        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', () => {
            console.log('pointerdown on business cell');
        });
    }
}
