# Documentation

## General informations

- We need rows and columns to create Dynamic Grids
- Both Rows and Columns cannot be odd number since it is card matching game. If rows * columns = odd number, user will never win the game since one card image will be left and no cards to match.
- So, if rows * columns = odd number, return 'INVALID GRID SIZE'

## GridInitialize.ts

- createGridLayout() - This function creates dynamic grid layouts based on rows and columns. CardParent position should be adjusted everytime the grid cell is created. If not, the grid will not be in center of the screen.
- generatePairs() - This function generates the equal amount of pairs ratios. Potential bug(If we do not generate pairs equally) - The different pairs might be left and user does not have same pairs to match even if the remaining cards lengh is even number.
- shuffleArray() - This function shuffles the array to be random index.

## CardProperty.ts

- suit variable and createCardImage() determines which card images the system need to load and show to user.
- flipCard() - This function makes the card to flip with tween system. If the card scale becomes 0, we change front real image from back image.
- invertCard() - This function makes the card to its original scale and show back image to user.
- Everytime user clicks the image, audio clip will be released.

## EnumDefine.ts

- Enum message events for notification

## MessageManager.ts
- Observer Pattern
- This emits a message to let the system knows that if something important is finished.
- on() - Listen to event
- dispatchEvent() - emit a message
- off - delete event listener.

## Caculate.ts

- This function caculates scoring point, winning moment, turning count, saving data, loading data and restarting scene.
- calculateCard() - this function creates turning count and winning condition.
- restartCurrentScene() - This function restarts the scene.
- saveData() - This saves data even if user left the game. User can load the current data if the data is saved in localStorage - Same as PlayerPref.
- loadData() - This loads the saved data in localStorage. This loads card names, card positions, card parent position, turning counts and score points and scene number.
