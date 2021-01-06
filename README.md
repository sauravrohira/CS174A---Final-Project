Our project is meant to be a morbid scene of a bird exploring a scene post a volcanic explosion. The raggedness of the terrain, the music, and the scattered broken objects reflect this.   

We created the terrain using the concepts of Marching Cubes and Perlin Noise. After perfecting the marching cubes algorithm, we used the perlin noise function to decide which cube vertices need to be drawn and then use the edge table and tri-table from our marching cubes implementation to find the vertices of the triangles that have to be drawn. 

Important Note: 

chrome://flags/#autoplay-policy 

The Chrome autoplay policy must be changed to “No user gesture required” to hear the background music as well as the sound effects. Copy pasting the above link into your chrome browser will allow you to make the above changes. 
 
 When we run our program on the server we get a "Pause before potential out-of-memory crash" error. The reason for this is that we are using almost all the heap availabe to render our terrain. However, all we have to do is press the "Resume Script Execution" arrow button in the debugger and the program continues running without any errors. The grid generation, perlin noise computations and marching cubes algorithm take up a lot of memory and this produces the error. We've added a screenshot showing the amount of heap used by our program.

 
Advanced Topics Used:

Marching Cubes: We used the marching cubes algorithm to render the terrain in the scene. This algorithm uses vertex interpolation and a certain function to decide which vertices are in and out of the final render. This was challenging to implement for a few reasons:
On a conceptual level, understanding how exactly to use the edge table and the tritable was difficult at first. 
It was difficult to construct an accurate grid, specially when we were dealing a 100+ grid cells in every direction. We kept messing this up, and later realised it was because of our lack of understanding of Javascript and its use of pointers. We didn’t realise that equating two arrays using ‘=’ passes a pointer rather than a copy of the array. It was important that we knew where exactly each cell was to debug and manipulate our terrain. 
Because of the limited graphics capabilities of our machine, each change took a few minutes to load every time, making it tedious and frustrating to re-render.

Perlin Noise: This was perhaps the most challenging part of this project. All the functions we modelled our terrain off of were looking artificial and lifeless. After some research, we found that natural scenes are typically rendered using a “random” noise function called Perlin Noise. We attempted to incorporate that into our implementation, but faced the following challenges:
All the Perlin Noise implementations we found online relied on using decimal values for each vertex, but our cubes were of size 1x1x1. This meant that we didn’t have a single decimal vertex value.
The complex implementation of this function added significant overhead to our program, making it slower.
         
Other Difficulties Faced: 

We had to work our way around “promise rejection” errors while attempting to play sound
The marching cubes, grid generation and perlin noise implementation also made us use most of the memory provided on our heap, and therefore it was difficult to even request for more memory
Implementation of a skybox. We worked on trying to create a skybox to surround our landscape but after a lot of effort were not able to create a shader that worked for 6 2d squares, or one that used the GPU’s Cube Map feature.

Team Members:

Ishaan Pota
Raghav Dhall
Saumya Dedhia
Saurav Rohira




