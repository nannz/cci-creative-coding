## What is the project

My project is called [The Jumping Snowman](https://git.arts.ac.uk/19040617/creative-computing/tree/master/term1-final-project/2-raymarch-snowman). This is marked part 2 in the repository. But if there should only be one project, the jumping snowman is the one you should look at. 

The Jumping Snowman is a fragment shader program that creates a 3D scene in which there is a snowman jumping towards you. Alongside there are trees and snowflakes/balls falling down. Everything is under a warm, glowing sun twilight.

The most significant feature is that it used the raymarching technique to create 3D models solely on fragment shader. The geometry in the scene is just on a planeGeo with two triangles. 

There is another project, which I marked as "part 1", called [Temple](https://git.arts.ac.uk/19040617/creative-computing/tree/master/term1-final-project/1-raymarch-temple). This project is more like my learning experience, in which I was first exposed to and explored 3D modelling, combing shapes, using different kinds of noise, setting a ray tracer, etc. 

## The Concept & Goal

For the concept and ideation part, I chose the theme of a snowman in a winter scene. Because it is winter, so why not?

However, besides the artistic expression, the goal behind the project is to push myself to study ray tracing, ray marching, and all the related knowledge. It was an excellent opportunity for me to learn shader languages from fundamentals.

## 📝Complete Documentation📝
The complete documentation on my learning experience is available on my blog: https://nanzhaodocumentations.wordpress.com/2021/01/15/creative-computing-term-1-assessment-my-shader-world-in-raymarching-%f0%9f%91%be/.
The blog posts are strongly recommended to take a look. I recorded all my thoughts, doubts, findings, and thinking process on it. 

### Reference
[Inigo Quilez](https://iquilezles.org/) has strongly inspired me throughout the journey. The majority techniques in my project, such as raymarching, normal derivative calculations and noise/random/hash functions are the practical uses of his theories.
Another note is that I first started developing my shaders and tryings on shaderToy, because it was easier to see the output in real time and do troubleshooting. 

## What's ray tracing & raymarching
How to draw 3D stuff on a 2D canvas? There have been several ways to do so, including rasterization, ray tracing, and pathtracing. The technique I heavily applied in my project is raymarching. 

Rasterization. It takes vector data into pixels. Before in Creative Computing Week 5, I further developed the example code by Prof Mick and wrote my 3D-to-2D map functions. I ended up drawing a sphere with triangle strips across the shape by calculating the current vertice and the ones beside and below.

For ray tracing, imagine there is a ray casted from the camera through every pixel. Once the ray bounced an object, it records the data and sends more rays to each light source from the intersection so that we can see the illumination effects. Ray marching is similar to ray tracing. But it is cheaper because in raymarching we march forward and test for the intersection.

## ro and rd

There are two main variables in the raymarching system --- ray origin(ro) and ray direction(rd). Shapes are drawn with signed distance functions(SDF).

You create a for loop, and in the loop, you move t distance in the ray direction to check if it hits the object you want to know, if so, then the distance between the ro to the object can be calculated as ``` distance = ro + t * rd ```. 

The pos is the sampling position along the ray. And we increase t over each loop. Then we calculate the mathematical equation of shapes (SDF). For example, the SDF function for a sphere is simply ``` length(pos) - radius```. This is the map() function below in the example code. So if the h is smaller than zero, we are inside the sphere; otherwise, we are still outside the sphere. Meanwhile, we also set the max t to break the loop to save power.
``` 
vec2 castRay(in vec3 ro, vec3 rd)
{
    float m = -1.01;
    float t = 0.0;
    for(int i = 0; i < 100; i ++)
    {
        vec3 pos = ro + t * rd;
        vec2 h = map(pos);//the map function contains the SDFs. It returns the distance value as h.x and the ID for each object as h.y.
        m = h.y;
        if(h.x < 0.001) break;//inside the ball.
        t += h.x;
        if(t>20.0) break;//the max 
    }
    if (t > 20.0) m = -1.0;
    return vec2(t,m);//the m here is the virable we gave to each object to distinguish them from each other.
}
```
Also, the normal calculation is from normal derivation. 
It calculates the difference from the central point and the points oriented. More on Inigo's article [here](https://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm).

## 3D modelling 

### for the snowman

**Shape**: The basic shapes for the snowman are two spheres. I used min() to combine the shapes. Furthermore, I used "smooth min()" to blend shapes and make the juncture line smoother. 
The eyes are two spheres. And the nose is made by a cone shape. They all blend with the main shape by min().
**The jumping animation**: The jumping effect is achieved by changing the snowman's centre according to time. I recorded the integer and the fraction part of the time and used pow() to apply the change of y in the centre. Later, I further implement the x value to make the snowman jump left and right. 

``` 
vec3 cen = vec3(0.0,
pow(y, 2.0-y) + 0.1,
itime + pow(ftime, 0.7)); //jumping forward.Use floor and fract to create a bounce jump
```
### for the tree

**Shape**: The shape is the combination of rounded cone and a column. 
**Forest**: Used ``` mod() ``` to create many many trees. 
**Surface**: Later in the development process, I applied noise on the surface so the trees have more details. So as to the thickness of the tree stumps and the ground.

## Noise Functions

I explored different ways to do noise/random effects in both part 1(temple) and part2(snowman) projects. It includes traditional noise function (the smoothNoise function), the fbm(Fracional Brownian Motion), and the hash function. 

**SmoothNoise**: It is the traditional way to make the noise, by calculating the four points around the point we want to calculate. That's the reason why ```id``` is added by vec2(1,0), vec2(0,1), and vec2(1,1). 
**FBM**: It is by adding multiple noises together. Each time we doubled the frequency and at the same time make the amplitude twice smaller.
**Hash**: I first got touch with the concept of hash is through shadertoy. A hash function is any function that can be used to map data of arbitrary size to fixed-size values. In our noise generator, we applied hash as the seed of a random number generator. So you can notice hash functions are applied in noise() function.
Last but not least, **another way to do "random",** is to create a unique id for the position and added whatever numbers onto the id then applied them in a sine function. The numbers could confuse the sin and created a fake random effect. I learned this knowledge from a video by Inigo Quilez. The snowballs on the ground used this technique.

## Lighting

The lighting part is also an exciting part. Actually, it's the most exciting part after drawing the scene. According to the PIXAR lighting rule, we created three lights: the sun light, the ambient light, the bounce light. There are also soft shadow, specular light, occlusion, fog applied into the scene. 
In the end, we do gamma correction on the colors. We used sqrt() function or just simply multiply the col by 0.45545.
The excellent explanation is on Inigo's blog [here](https://iquilezles.org/www/articles/outdoorslighting/outdoorslighting.htm).

## Personal Retrospective

It has been an amazing learning period for me to understand the world of shader. My vision is to create astonishing, impressive visual effects through computation. I am so glad I meet shader at this point.  Simply by mathematical functions, I was able to create a world with marvellous looks. 

Alongside the raymarching technique, I discovered so much knowledge about shading, illumination, occlusion and so on. The shader to me is far beyond the crazy math shapes (they are also cool of course!) but the tool I could use to explore the world and touch people. 

I couldn't appreciate it more that I have the professor and Inigo inspiring me, have the videos and articles written by Inigo instructing me. 
There is still a lot to explore. I have just understood the basics and stepped into the shader world. Some future directions are path tracing for fractals and water effects with reflection, refraction, and transparency. :-)
