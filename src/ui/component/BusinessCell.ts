import { Container, Text, Sprite } from 'pixi.js';
import { ProgressBar } from './ProgressBar';
import { TextureUtil } from '../../util/TextureUtil';
import { TimeUtil } from '../../util/TimeUtil';

// states: Locked vs Unlocked
// Locked: purchaseable or not
// Unlocked:
//     InfoCell -- tap action & upgrade status & level
//     ProfitBar
//     UpgradeButton
//     TimeCell
//     ManagerCell
class LockedBusinessCell extends Container {
    public background: Sprite;
    public businessSprite: Sprite;
    public businessNameLabel: Text;
    public unlockPriceLabel: Text;

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
    public businessSprite: Sprite;
    public upgradeButton: Sprite;
    public upgradeProgressBar: ProgressBar;
    public workProgressBar: ProgressBar;
    public costLabel: Text;
    public timeToProfitLabel: Text;

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

        this.upgradeButton = new Sprite(TextureUtil.createTexture('#F000F0'));
        this.upgradeButton.width = 368;
        this.upgradeButton.height = 80;
        this.upgradeButton.x = this.businessSprite.width;
        this.upgradeButton.y = 48;
        this.addChild(this.upgradeButton);

        this.upgradeProgressBar = new ProgressBar({
            width: 128,
            height: 32,
        });
        this.addChild(this.upgradeProgressBar);

        this.workProgressBar = new ProgressBar({
            width: 432,
            height: 48,
        })
        this.workProgressBar.x = 128;
        this.addChild(this.workProgressBar);

        this.costLabel = new Text('');
        this.addChild(this.costLabel);
        this.setCost('666');

        this.timeToProfitLabel = new Text('');
        this.timeToProfitLabel.y = 32;
        this.addChild(this.timeToProfitLabel);
    }

    public setup(currentAmount: number, nextMilestone: number, cost: number, profit: number, workAction: ()=>void, upgradeAction: ()=>void): void {
        this.upgradeProgressBar.setText(`${currentAmount}/${nextMilestone}`);
        this.upgradeProgressBar.setProgress(currentAmount/nextMilestone);

        this.setCost(cost.toFixed(2));
        this.setProfit(profit.toFixed(2));

        this.businessSprite.interactive = true;
        this.businessSprite.buttonMode = true;
        this.businessSprite.removeAllListeners();
        this.businessSprite.on('pointerdown', workAction);

        this.upgradeButton.interactive = true;
        this.upgradeButton.buttonMode = true;
        this.upgradeButton.removeAllListeners();
        this.upgradeButton.on('pointerdown', upgradeAction); // TODO clear before?
    }

    public setProfit(profitText: string): void {
        this.workProgressBar.setText(`$${profitText}`);
    }

    public setCost(costText: string): void {
        this.costLabel.text = `$${costText}`;
        this.costLabel.x = this.workProgressBar.x;
        this.costLabel.y = this.height - this.costLabel.height;
    }

    public setTimeToProfit(text: string): void {
        this.timeToProfitLabel.text = text;
        this.timeToProfitLabel.x = this.width - this.timeToProfitLabel.width;
        this.timeToProfitLabel.y = this.height - this.timeToProfitLabel.height;
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

    public setupUnlocked(currentAmount: number, nextMilestone: number, cost: number, profit: number, workAction: ()=>void, upgradeAction: ()=>void): void {
        if(this.unlocked === null) {
            this.locked?.destroy();
            this.unlocked = new UnlockedBusinessCell();
            this.addChild(this.unlocked);
        }
        this.unlocked.setup(currentAmount, nextMilestone, cost, profit, workAction, upgradeAction);
    }

    public setTimeToProfit(ts: number): void {
        console.assert(this.unlocked !== null, 'should be unlocked');
        this.unlocked.setTimeToProfit(TimeUtil.secondsToString(ts));
    }

    public setProfitProgress(progress: number): void {
        console.assert(this.unlocked !== null, 'should be unlocked');
        this.unlocked.workProgressBar.setProgress(progress);
    }
}
