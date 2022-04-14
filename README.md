### React searching photos app from unsplash

Access here: **https://photo-searching.netlify.app**

A code along project by John Smilga. I managed to solve a minor **bug**: When typing in query term for photos, without hitting enter the new photos loaded will be of the query term.

the method was instead of setQuery in onChange, capture the query using **useRef** at handle submit.

![screen shot](./src/screenShot.png 'screenshot')
