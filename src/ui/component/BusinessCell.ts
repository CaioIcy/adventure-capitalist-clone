import { Container, Text, Sprite, Texture, filters } from 'pixi.js';
import { ManagerCell } from './ManagerCell';
import { ProgressBar } from './ProgressBar';
import { TextureUtil } from '../../util/TextureUtil';
import { TimeUtil } from '../../util/TimeUtil';

const BWIDTH = 496;
const BHEIGHT = 128;

interface UpgradeButtonOptions {
    width: number;
    height: number;
}

class UpgradeButton extends Container {
    private background: Sprite;
    private buyLabel: Text;
    private amountLabel: Text;
    private costLabel: Text;

    public constructor(options: UpgradeButtonOptions) {
        super();

        const { width, height } = options;

        this.width = width;
        this.height = height;

        this.background = new Sprite(Texture.WHITE);
        this.background.width = width;
        this.background.height = height;
        this.background.tint = 0xf79b19;
        this.addChild(this.background);

        this.buyLabel = new Text('BUY');
        this.addChild(this.buyLabel);

        this.amountLabel = new Text('');
        this.addChild(this.amountLabel);
        this.setAmount('x?');
        this.amountLabel.y = this.height - this.amountLabel.height;

        this.costLabel = new Text('');
        this.addChild(this.costLabel);
        this.setCost('OOOOO');
    }

    public setCallback(callback: ()=>void): void {
        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.removeAllListeners();
        this.background.on('pointerdown', callback);
    }

    public setCost(costText: string): void {
        console.log(1, this.costLabel.width);
        this.costLabel.text = `$${costText}`;
        console.log(2, this.costLabel.width);
        this.costLabel.updateTransform();
        this.costLabel.x = this.width - this.costLabel.width * 1.5; // TODO ?
        this.costLabel.y = this.height - this.costLabel.height;
    }

    public setAmount(amountText: string): void {
        this.amountLabel.text = amountText;
    }
}

class LockedBusinessCell extends Container {
    public background: Sprite;
    public businessSprite: Sprite;
    public businessNameLabel: Text;
    public unlockPriceLabel: Text;

    public constructor() {
        super();

        this.background = new Sprite(Texture.WHITE);
        this.background.tint = 0x918881;
        this.background.width = BWIDTH;
        this.background.height = BHEIGHT;
        this.addChild(this.background);

        this.businessSprite = new Sprite(Texture.WHITE);
        this.businessSprite.x += 32;
        this.businessSprite.y += 16;
        this.businessSprite.width = 96;
        this.businessSprite.height = 96;
        this.addChild(this.businessSprite);

        this.businessNameLabel = new Text('');
        this.businessNameLabel.x = BWIDTH/2;
        this.addChild(this.businessNameLabel);

        this.unlockPriceLabel = new Text('');
        this.unlockPriceLabel.x = BWIDTH/2;
        this.unlockPriceLabel.y += this.unlockPriceLabel.height;
        this.addChild(this.unlockPriceLabel);
    }

    public setup(tex: Texture, businessName: string, unlockPrice: number, action: ()=>void): void {
        this.businessSprite.texture = tex;

        this.businessNameLabel.text = businessName;
        this.unlockPriceLabel.text = `$ ${unlockPrice}`;

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.on('pointerdown', action);
    }
}

class UnlockedBusinessCell extends Container {
    private background: Sprite;
    public businessSprite: Sprite;
    public upgradeButton: UpgradeButton;
    public upgradeProgressBar: ProgressBar;
    public workProgressBar: ProgressBar;
    public timeToProfitLabel: Text;
    public managerCell: ManagerCell;

    public constructor() {
        super();

        this.width = BWIDTH;
        this.height = BHEIGHT;

        this.background = new Sprite(Texture.WHITE);
        this.background.tint = 0xefefef;
        this.background.width = BWIDTH;
        this.background.height = BHEIGHT;
        this.addChild(this.background);

        this.businessSprite = new Sprite(TextureUtil.createTexture('#FF00FF'));
        this.businessSprite.width = BHEIGHT;
        this.businessSprite.height = BHEIGHT;
        this.addChild(this.businessSprite);

        this.upgradeProgressBar = new ProgressBar({
            width: BHEIGHT,
            height: 32,
        });
        this.upgradeProgressBar.y = this.height - this.upgradeProgressBar.height;
        this.addChild(this.upgradeProgressBar);

        this.workProgressBar = new ProgressBar({
            width: 368,
            height: 48,
        })
        this.workProgressBar.x = BHEIGHT;
        this.addChild(this.workProgressBar);

        this.upgradeButton = new UpgradeButton({
            width: BWIDTH - this.businessSprite.width - 96,
            height: BHEIGHT - this.workProgressBar.height,
        });
        this.addChild(this.upgradeButton);
        this.upgradeButton.x = this.businessSprite.width;
        this.upgradeButton.y = this.workProgressBar.height;
        this.upgradeButton.setCost('666');

        this.timeToProfitLabel = new Text('');
        this.addChild(this.timeToProfitLabel);
        this.timeToProfitLabel.y = this.workProgressBar.height + (BHEIGHT - this.workProgressBar.height)*0.5 - this.timeToProfitLabel.height*0.5;
        this.setTimeToProfit('');

        this.managerCell = new ManagerCell();
        this.managerCell.x = BWIDTH;
        this.managerCell.y = BHEIGHT * 0.5 - this.managerCell.height * 0.5;
        this.addChild(this.managerCell);
    }

    public setup(businessTexture: Texture, managerTexture: Texture, workAction: ()=>void, upgradeAction: ()=>void): void {
        this.businessSprite.texture = businessTexture;
        this.managerCell.setTexture(managerTexture);

        this.businessSprite.interactive = true;
        this.businessSprite.buttonMode = true;
        this.businessSprite.removeAllListeners();
        this.businessSprite.on('pointerdown', workAction);

        this.upgradeButton.setCallback(upgradeAction);
    }

    public update(currentAmount: number, nextMilestone: number, cost: number, profit: number, hasManager: boolean): void {
        this.upgradeProgressBar.setText(`${currentAmount}/${nextMilestone}`);
        this.upgradeProgressBar.setProgress(currentAmount/nextMilestone);

        this.upgradeButton.setCost(cost.toFixed(2));
        this.setProfit(profit.toFixed(2));

        this.managerCell.enableGreyscaleFilter(!hasManager);
    }

    public setProfit(profitText: string): void {
        this.workProgressBar.setText(`$${profitText}`);
    }

    public setTimeToProfit(text: string): void {
        this.timeToProfitLabel.text = text;
        this.timeToProfitLabel.x = BWIDTH - this.timeToProfitLabel.width - 16; // TODO
    }
}

export class BusinessCell extends Container {
    private locked: LockedBusinessCell = null;
    private unlocked: UnlockedBusinessCell = null;

    public constructor() {
        super();
    }

    public setupLocked(businessTexture: Texture, businessName: string, unlockPrice: number, action: ()=>void): void {
        if(this.locked === null) {
            this.unlocked?.destroy();
            this.locked = new LockedBusinessCell();
            this.addChild(this.locked);
        }
        this.locked.setup(businessTexture, businessName, unlockPrice, action);
    }

    public setupUnlocked(businessTexture: Texture, managerTexture: Texture, workAction: ()=>void, upgradeAction: ()=>void): void {
        if(this.unlocked === null) {
            this.locked?.destroy();
            this.unlocked = new UnlockedBusinessCell();
            this.addChild(this.unlocked);
        }
        this.unlocked.setup(businessTexture, managerTexture, workAction, upgradeAction);
    }

    public updateUnlocked(currentAmount: number, nextMilestone: number, cost: number, profit: number, hasManager: boolean): void {
        console.assert(this.unlocked !== null, 'should be unlocked');
        this.unlocked.update(currentAmount, nextMilestone, cost, profit, hasManager);
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
