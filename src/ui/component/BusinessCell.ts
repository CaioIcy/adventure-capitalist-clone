import { Container, Text, Sprite } from 'pixi.js';
import { ProgressBar } from './ProgressBar';
import { TextureUtil } from '../../util/TextureUtil';

// states: Locked vs Unlocked
// Locked: purchaseable or not
// Unlocked:
//     InfoCell -- tap action & upgrade status & level
//     ProfitBar
//     UpgradeButton
//     TimeCell
//     ManagerCell
class LockedBusinessCell extends Container {
    private background: Sprite;
    private businessSprite: Sprite;
    private businessNameLabel: Text;
    private unlockPriceLabel: Text;

    public constructor() {
        super();

        this.background = new Sprite(TextureUtil.createTexture('#0000FF'));
        this.background.width = 560;
        this.background.height = 128;
        this.addChild(this.background);

        this.businessSprite = new Sprite(TextureUtil.createTexture('#FF00FF'));
        this.businessSprite.x += 32;
        this.businessSprite.y += 16;
        this.businessSprite.width = 96;
        this.businessSprite.height = 96;
        this.addChild(this.businessSprite);

        this.businessNameLabel = new Text('');
        this.businessNameLabel.x = 560/2;
        this.addChild(this.businessNameLabel);

        this.unlockPriceLabel = new Text('');
        this.unlockPriceLabel.x = 560/2;
        this.unlockPriceLabel.y += this.unlockPriceLabel.height;
        this.addChild(this.unlockPriceLabel);
    }

    public setup(businessName: string, unlockPrice: number, action: ()=>void): void {
        this.businessNameLabel.text = businessName;
        this.unlockPriceLabel.text = `$ ${unlockPrice}`;

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.on('pointerdown', action);
    }
}

class UnlockedBusinessCell extends Container {
    private businessSprite: Sprite;
    private text: Text;
    private progressBar: ProgressBar;

    public constructor() {
        super();

        this.width = 560;
        this.height = 128;

        const debugBackground = new Sprite(TextureUtil.createTexture('#FF0000'));
        debugBackground.width = 560;
        debugBackground.height = 128;
        this.addChild(debugBackground);

        this.businessSprite = new Sprite(TextureUtil.createTexture('#FF00FF'));
        this.businessSprite.width = 128;
        this.businessSprite.height = 128;
        this.addChild(this.businessSprite);

        this.progressBar = new ProgressBar({
            width: 128,
            height: 32,
        });
        this.addChild(this.progressBar);

        this.text = new Text('businesscell');
        this.text.x = 560/2;
        this.addChild(this.text);
    }

    public setup(workAction: ()=>void): void {
        this.businessSprite.interactive = true;
        this.businessSprite.buttonMode = true;
        this.businessSprite.on('pointerdown', workAction); // TODO clear before?
    }
}

export class BusinessCell extends Container {
    private locked: LockedBusinessCell = null;
    private unlocked: UnlockedBusinessCell = null;

    public constructor() {
        super();
    }

    public setupLocked(businessName: string, unlockPrice: number, action: ()=>void): void {
        if(this.locked === null) {
            this.unlocked?.destroy();
            this.locked = new LockedBusinessCell();
            this.addChild(this.locked);
        }
        this.locked.setup(businessName, unlockPrice, action);
    }

    public setupUnlocked(workAction: ()=>void): void {
        if(this.unlocked === null) {
            this.locked?.destroy();
            this.unlocked = new UnlockedBusinessCell();
            this.addChild(this.unlocked);
        }
        this.unlocked.setup(workAction);
    }
}
