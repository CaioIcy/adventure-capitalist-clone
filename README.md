# Adventure Capitalist Clone

Adventure Capitalist is an idle business sim-game. The basic idea is to purchase a business, win capital from that business, upgrade the business and then purchase more businesses. In order to automate the process for a business, you can hire a manager for it.

## Play
You can play it here: https://caioicy.github.io/adventure-capitalist-clone/dist

### Specifications

Basic:
* Buy and upgrade businesses. There should be several business types to choose from.
* Make money from a business. (i.e. you click on a business and in a certain amount of
time you get money)
* Hire managers, so that money is made automatically.
* When you close the game, next time you open it, you should see the money that your
businesses made for you. (Businesses continue to make progress while you’re away.)

Extra:
* Able to toggle by how much you want to upgrade a business (cycles between x1, x10, x100)

### Architectural Decisions

The game was implemented using [PixiJS](https://www.pixijs.com/) and [TypeScript](https://www.typescriptlang.org/) as a client-side only version with persistency through [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). The directory structure is as follows:

```sh
└───src
│   └───config        # game calibration
│   └───controller    # business logic and scene controls
│   └───state         # state management & persistency
│   └───ui
│      └───component  # reusable UI components
│      └───view       # main view objects that represent a controller
│      └───util
│   └───util
```

* `config`: self-contained module that could have configuration files (e.g. JSON) injected remotely to configure game calibration
* `controller`: controls the game loop and ties together the input from the view to the state
* `state`: a single source of truth for the player's state, implemented in a way that can easily change the method of persistency (local vs remote, whatever the means)
* `ui/component`: contains reusable UI objects that don't necessarily map to a single view
* `ui/view`: UI representation for a controller

The entrypoint for the game is `app.ts`, a simple bootstrap for the PixiJS framework and config/state initialization. For the controllers I chose a stack for managing which scene is active (through `ControllerStack.ts`), because having a stack for each controller would be overkill in this version of the game.

The ability to listen to state changes (through `BaseState.ts`) proves very useful, for example by having the player's money update whenever a business is finished working. In a game with a complex screen and many states it can be a hard thing to maintain, and by separating which states are being listened to and what needs to change with them brings greater maintainability.

## Technical Decisions

In this section I'll try to explain the rationale behind how each main feature was implemented in more detail.

To start, these are the persisted states in the game:
```
managers = [{id, amount}, ...]
businesses = [{id, amount, workTimestamp}, ...]
game = {initialized, lastTimestamp}
wallet = {money}
```

The `initialized` from the Game state simply defines whether it is a new game or not, to setup the default businesses and managers, initial money, etc.

For Businesses and Managers, the `amount` represents how much of that item you have acquired through upgrades. For Managers specifically it will always be either 0 (not hired), 1 (hired) since there is no upgrading managers in this version.

The `workTimestamp` in Business is used to determine whether it is actively working on generating money or not. If the manager is not hired, the timestamp is set to the future by the player's click. If the manager is hired, the timestamp is automatically by having the manager for that business.

The `lastTimestamp` from the Game state is how the offline profit works. It indicates the timestamp of the last game loop the player had the game open, and through it we can calculate the profit of all the managed businesses the player owns.


## Next Steps

UX:
* Add feedback for when trying to purchase something and the player does not have enough money;
* Add a canPurchase/cantPurchase state for the buttons, to indicate whether the player has enough money or not;
* Add a new state for the business progress bar when the time-to-profit is really short, much like the original game;

Code quality:
* More clearly separate the Views from the Controllers, there are some leftovers that I can't clean up due to time constraints. Also the BaseController probably doesn't need to extend PixiJS's Container;
* Extract some responsibilities from the MainController, that class got pretty big and I feel it could be improved;

General:
* Allow remote calibration of the game by hosting the configuration files somewhere, and then injecting it into the configs;
* Backend server! Should be fairly simple to plug into the `state` files the way they were designed.
