import { Container, Text, Sprite, Texture, filters } from 'pixi.js';
import { ManagerCell } from './ManagerCell';
import { ProgressBar } from './ProgressBar';
import { Background } from './Background';
import { TextUtil } from '../util/TextUtil';
import { TimeUtil } from '../../util/TimeUtil';
import { MoneyUtil } from '../../util/MoneyUtil';

interface UpgradeButtonOptions {
    width: number;
    height: number;
}

class UpgradeButton extends Container {
    private background: Background;
    private buyLabel: Text;
    private amountLabel: Text;
    private costLabel: Text;
    private pad: number;

    public constructor(options: UpgradeButtonOptions) {
        super();

        const { width, height } = options;
        const pad = 4;
        this.pad = pad;

        this.background = new Background({
            tint: 0xee8d1f,
            borderTint: 0xd47913,
            width,
            height,
            pad,
        });
        this.addChild(this.background);

        const textStyle = {
            fill: 'white',
            dropShadow: true,
            dropShadowColor: 'black',
            dropShadowDistance: 2,
            // stroke: 'black',
            // strokeThickness: 3,
        };
        this.buyLabel = new Text('BUY', TextUtil.createStyle(textStyle));
        this.buyLabel.x = pad*4;
        this.buyLabel.y = pad;
        this.addChild(this.buyLabel);

        this.amountLabel = new Text('', TextUtil.createStyle(textStyle));
        this.setAmount('x?');
        this.addChild(this.amountLabel);
        this.amountLabel.y = pad;

        this.costLabel = new Text('', TextUtil.createStyle(textStyle));
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
        this.costLabel.text = costText;
        this.costLabel.x = this.pad*4;//this.width - this.costLabel.width * 1.5; // TODO ?
        this.costLabel.y = this.height - this.costLabel.height - this.pad;
    }

    public setAmount(amountText: string): void {
        this.amountLabel.text = amountText;
        this.amountLabel.x = this.width - this.amountLabel.width - this.pad*4;
    }
}

class LockedBusinessCell extends Container {
    public background: Sprite;
    public businessSprite: Sprite;
    public businessNameLabel: Text;
    public unlockPriceLabel: Text;

    public constructor() {
        super();

        const width = 496;
        const height = 128;

        this.background = new Sprite(Texture.WHITE);
        this.background.tint = 0x918881;
        this.background.width = width;
        this.background.height = height;
        this.addChild(this.background);

        this.businessSprite = new Sprite(Texture.WHITE);
        this.businessSprite.x += 32;
        this.businessSprite.y += 16;
        this.businessSprite.width = 96;
        this.businessSprite.height = 96;
        this.addChild(this.businessSprite);

        this.businessNameLabel = new Text('', TextUtil.defaultStyle());
        this.businessNameLabel.x = width/2;
        this.addChild(this.businessNameLabel);

        this.unlockPriceLabel = new Text('', TextUtil.defaultStyle());
        this.unlockPriceLabel.x = width/2;
        this.unlockPriceLabel.y += this.unlockPriceLabel.height;
        this.addChild(this.unlockPriceLabel);
    }

    public setup(tex: Texture, businessName: string, unlockPriceStr: string, action: ()=>void): void {
        this.businessSprite.texture = tex;

        this.businessNameLabel.text = businessName;
        this.unlockPriceLabel.text = unlockPriceStr;

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.on('pointerdown', action);
    }
}

class UnlockedBusinessCell extends Container {
    public businessBackground: Background;
    public businessSprite: Sprite;
    public upgradeButton: UpgradeButton;
    public upgradeProgressBar: ProgressBar;
    public workProgressBar: ProgressBar;
    public timeToProfitLabel: Text;
    public managerCell: ManagerCell;
    private __width: number;
    private __height: number;
    private pad: number;

    public constructor() {
        super();

        const width = 496;
        const height = 128;

        this.__width = width;
        this.__height = height;

        const pad = 4;
        this.pad = pad;

        this.businessBackground = new Background({
            tint: 0x1d6bc4,
            borderTint: 0x08458a,
            width: height - pad,
            height,
            pad
        });
        this.addChild(this.businessBackground);

        const businessSize = Math.ceil(height*0.5);
        this.businessSprite = new Sprite(Texture.WHITE);
        this.businessSprite.width = businessSize;
        this.businessSprite.height = businessSize;
        this.businessSprite.x = this.businessBackground.width * 0.5 - this.businessSprite.width*0.5;
        this.businessSprite.y = this.businessBackground.height * 0.40 - this.businessSprite.height*0.5;
        this.addChild(this.businessSprite);

        this.upgradeProgressBar = new ProgressBar({
            width: this.businessBackground.width,
            height: 32,
        });
        this.upgradeProgressBar.y = this.height - this.upgradeProgressBar.height;
        this.addChild(this.upgradeProgressBar);

        this.workProgressBar = new ProgressBar({
            width: 352 - pad,
            height: 48,
        })
        this.workProgressBar.x = height;
        this.addChild(this.workProgressBar);

        this.upgradeButton = new UpgradeButton({
            width: width - this.businessBackground.width - 128,
            height: height - this.workProgressBar.height - pad,
        });
        this.addChild(this.upgradeButton);
        this.upgradeButton.x = this.businessBackground.width + pad;
        this.upgradeButton.y = this.workProgressBar.height + pad;
        this.upgradeButton.setCost('666');

        const ttpBackground = new Background({
            tint: 0x655d52,
            darkTint: 0x655d52,
            lightTint: 0x655d52,
            borderTint: 0x373737,
            width: this.workProgressBar.width - this.upgradeButton.width - pad,
            height:this.upgradeButton.height - pad,
            pad: 4,
        });
        this.addChild(ttpBackground);
        ttpBackground.x = this.upgradeButton.x + this.upgradeButton.width + pad;
        ttpBackground.y = this.workProgressBar.height + pad;

        this.timeToProfitLabel = new Text('', TextUtil.defaultStyle());
        this.addChild(this.timeToProfitLabel);
        this.timeToProfitLabel.y = this.workProgressBar.height + (height - this.workProgressBar.height)*0.5 - this.timeToProfitLabel.height*0.5;
        this.setTimeToProfit('');

        this.managerCell = new ManagerCell({
            width: 64,
            height: 64,
        });
        this.managerCell.x = width;
        this.managerCell.y = height * 0.5 - this.managerCell.height * 0.5;
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

    public update(buyAmountStr: string, currentAmount: number, nextMilestone: number, cost: number, profit: number, hasManager: boolean): void {
        this.upgradeProgressBar.setText(`${currentAmount}/${nextMilestone}`);
        this.upgradeProgressBar.setProgress(currentAmount/nextMilestone);

        this.upgradeButton.setAmount(buyAmountStr)
        this.upgradeButton.setCost(MoneyUtil.moneyToString(cost));
        this.setProfit(MoneyUtil.moneyToString(profit));

        this.managerCell.enableGreyscaleFilter(!hasManager);
    }

    public setProfit(profitText: string): void {
        this.workProgressBar.setText(profitText);
    }

    public setTimeToProfit(text: string): void {
        this.timeToProfitLabel.text = text;
        this.timeToProfitLabel.x = (this.workProgressBar.x + this.workProgressBar.width) - this.timeToProfitLabel.width - this.pad*2;
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
        this.locked.setup(businessTexture, businessName, MoneyUtil.moneyToString(unlockPrice), action);
    }

    public setupUnlocked(businessTexture: Texture, managerTexture: Texture, workAction: ()=>void, upgradeAction: ()=>void): void {
        if(this.unlocked === null) {
            this.locked?.destroy();
            this.unlocked = new UnlockedBusinessCell();
            this.addChild(this.unlocked);
        }
        this.unlocked.setup(businessTexture, managerTexture, workAction, upgradeAction);
    }

    public updateUnlocked(buyAmountStr: string, currentAmount: number, nextMilestone: number, cost: number, profit: number, hasManager: boolean): void {
        console.assert(this.unlocked !== null, 'should be unlocked');
        this.unlocked.update(buyAmountStr, currentAmount, nextMilestone, cost, profit, hasManager);
    }

    public setTimeToProfit(ts: number): void {
        console.assert(this.unlocked !== null, 'should be unlocked');
        this.unlocked.setTimeToProfit(TimeUtil.secondsToString(ts));
    }

    public setProfitProgress(progress: number): void {
        console.assert(this.unlocked !== null, 'should be unlocked');
        this.unlocked.workProgressBar.setProgress(progress);
    }

    public setUnlockedManager(isManagerUnlocked: boolean): void {
        this.unlocked?.managerCell.enableGreyscaleFilter(!isManagerUnlocked);
    }

    public setManagerClickCallback(action: ()=>void): void {
        this.unlocked?.managerCell.setClickCallback(action);
    }
}
