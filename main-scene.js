import {tiny, defs} from './assignment-4-resources.js';
import {Shape_From_File} from './obj-file-demo.js';
const { Vec, Vec3, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Square, Subdivision_Sphere, Transforms_Sandbox_Base, Triangle,Terrain, Tetrahedron } = defs;

var call_once = 0;

var Triangles = [];
var Normals = [];

// edgeTable maps the cut edges to an array in triTable 

var edgeTable=[
0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
0x190, 0x99 , 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
0x230, 0x339, 0x33 , 0x13a, 0x636, 0x73f, 0x435, 0x53c,
0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
0x3a0, 0x2a9, 0x1a3, 0xaa , 0x7a6, 0x6af, 0x5a5, 0x4ac,
0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
0x460, 0x569, 0x663, 0x76a, 0x66 , 0x16f, 0x265, 0x36c,
0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff , 0x3f5, 0x2fc,
0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55 , 0x15c,
0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc ,
0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
0xcc , 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
0x15c, 0x55 , 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
0x2fc, 0x3f5, 0xff , 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
0x36c, 0x265, 0x16f, 0x66 , 0x76a, 0x663, 0x569, 0x460,
0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa , 0x1a3, 0x2a9, 0x3a0,
0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33 , 0x339, 0x230,
0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99 , 0x190,
0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0];

var triTable =
[[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1],
[3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1],
[3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1],
[3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1],
[9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1],
[1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1],
[9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1],
[2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1],
[8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1],
[9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1],
[4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1],
[3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1],
[1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1],
[4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1],
[4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1],
[9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1],
[1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1],
[5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1],
[2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1],
[9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1],
[0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1],
[2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1],
[10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1],
[4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1],
[5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1],
[5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1],
[9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1],
[0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1],
[1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1],
[10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1],
[8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1],
[2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1],
[7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1],
[9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1],
[2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1],
[11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1],
[9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1],
[5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1],
[11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1],
[11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1],
[1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1],
[9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1],
[5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1],
[2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1],
[0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1],
[5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1],
[6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1],
[0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1],
[3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1],
[6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1],
[5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1],
[1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1],
[10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1],
[6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1],
[1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1],
[8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1],
[7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1],
[3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1],
[5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1],
[0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1],
[9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1],
[8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1],
[5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1],
[0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1],
[6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1],
[10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1],
[10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1],
[8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1],
[1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1],
[3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1],
[0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1],
[10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1],
[0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1],
[3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1],
[6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1],
[9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1],
[8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1],
[3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1],
[6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1],
[0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1],
[10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1],
[10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1],
[1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1],
[2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1],
[7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1],
[7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1],
[2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1],
[1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1],
[11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1],
[8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1],
[0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1],
[7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1],
[10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1],
[2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1],
[6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1],
[7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1],
[2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1],
[1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1],
[10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1],
[10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1],
[0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1],
[7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1],
[6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1],
[8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1],
[9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1],
[6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1],
[1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1],
[4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1],
[10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1],
[8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1],
[0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1],
[1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1],
[8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1],
[10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1],
[4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1],
[10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1],
[5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1],
[11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1],
[9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1],
[6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1],
[7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1],
[3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1],
[7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1],
[9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1],
[3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1],
[6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1],
[9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1],
[1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1],
[4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1],
[7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1],
[6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1],
[3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1],
[0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1],
[6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1],
[1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1],
[0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1],
[11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1],
[6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1],
[5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1],
[9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1],
[1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1],
[1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1],
[10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1],
[0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1],
[5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1],
[10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1],
[11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1],
[0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1],
[9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1],
[7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1],
[2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1],
[8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1],
[9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1],
[9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1],
[1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1],
[9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1],
[9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1],
[5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1],
[0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1],
[10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1],
[2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1],
[0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1],
[0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1],
[9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1],
[5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1],
[3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1],
[5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1],
[8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1],
[0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1],
[9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1],
[0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1],
[1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1],
[3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1],
[4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1],
[9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1],
[11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1],
[11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1],
[2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1],
[9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1],
[3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1],
[1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1],
[4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1],
[4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1],
[0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1],
[3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1],
[3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1],
[0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1],
[9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1],
[1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]];

    // defining the size of our grid for marching cubes implementation 

    var num_gridcells_x = 150;
    var num_gridcells_y = 75;
    var num_gridcells_z = 150;

    // initialising our marching cubes grid 
            
    var Grid = new Array();

    for (let i = 0; i < num_gridcells_x*num_gridcells_y*num_gridcells_z; i++) {
      Grid[i] = new Array();
      for(let j = 0; j < 8; j++) {
        Grid[i][j] = new Array();
      }
    }

    var GridCell = []; 
    var counter = 0; 

    for(let i=-(num_gridcells_x/2); i<(num_gridcells_x/2); i++) {

        for(let m=-(num_gridcells_y/2); m<(num_gridcells_y/2); m++) {

            for(let k=-(num_gridcells_z/2); k<(num_gridcells_z/2); k++) {

                Grid[counter][0] = [i, m, k]; 
                Grid[counter][1] = [i+1, m, k]; 
                Grid[counter][2] = [i+1, m, k+1];
                Grid[counter][3] = [i, m, k+1];
                Grid[counter][4] = [i, m+1, k]; 
                Grid[counter][5] = [i+1, m+1, k];
                Grid[counter][6] = [i+1, m+1, k+1];
                Grid[counter][7] = [i, m+1, k+1]; 
                
                counter++;
            }
        }
    }

    var perm = new Uint8Array(512);
    var p = new Uint8Array(256);

    var grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];

const Main_Scene =

class Apocalypse extends Scene
{                                             
  constructor()
    {                  
      super();
                                                       
      const Flat_Obj = Shape_From_File.prototype.make_flat_shaded_version();
      const Subdivision_Sphere_Flat = Subdivision_Sphere.prototype.make_flat_shaded_version();
     
      this.shapes = {    'box' : new Square(),
                     'terrain' : new Terrain(),
                    'triangle' : new Triangle(),
                          'obj': new Flat_Obj("assets/DOVE_2.OBJ"),  
                       'jagged': new Tetrahedron(),
                         'tree': new Flat_Obj("assets/tree.obj"),  
                    };

      this.sounds = { 'background': new Audio('assets/background.wav' ),
                     }                                             
                                                              
      const phong_shader      = new defs.Phong_Shader;
      const texture_shader_2  = new defs.Fake_Bump_Map (2);

      this.materials = {
                            plastic: new Material( phong_shader,
                                    { ambient: 0, diffusivity: 1, specularity: 0, color: Color.of( 0.80,.20,0.20,1 ) } ),
                            rock: new Material( phong_shader, 
                                    {ambient: 0, diffusivity: 1, specularity: 0.2, color: Color.of(0.2,0.2,0.2,1)}),
                            dead_tree: new Material( texture_shader_2,
                                    { texture: new Texture( "assets/tree.jpg" ),
                                      ambient: 1, diffusivity: 1, specularity: .2, color: Color.of( 0,0,0,1 ) } ),
                            texture_bird: new Material( texture_shader_2,
                                    { texture: new Texture( "assets/DOVE.JPG" ),
                                      ambient: 1, diffusivity: 1, specularity: 1, color: Color.of( .75,.75,.75,1 ) } ),
                            texture_bird: new Material( texture_shader_2,
                                    { texture: new Texture( "assets/EAGLE_2.JPG" ),
                                      ambient: 1, diffusivity: 1, specularity: 1, color: Color.of( .75,.75,.75,1 ) } ),
      };

     this.up = this.down = this.left = this.right = this.move = this.reverse = false;
     this.bird_transform = Mat4.identity().times(Mat4.translation([0,10,0]));
     this.x = 0;
     this.z = 0;

     this.lights_on = true;
     this.star_matrices = [];
     for( let i=0; i<30; i++ )
        this.star_matrices.push( Mat4.rotation( Math.PI/2 * (Math.random()-.5), Vec.of( 0,1,0 ) )
                         .times( Mat4.rotation( Math.PI/2 * (Math.random()-.5), Vec.of( 1,0,0 ) ) )
                         .times( Mat4.translation([ 0,0,-150 ]) ) );

    }

    // background music 

    play_sound( name, volume = 1 ) { 

      if( 0 < this.sounds.background.currentTime && this.sounds.background.currentTime < .3 ) return;
      this.sounds.background.currentTime = 0;
      this.sounds.background.volume = Math.min(Math.max(volume, 0), 1);;
      var playPromise = Promise.resolve(this.sounds.background.play());
      if (playPromise !== undefined) {
           playPromise.then(function() {
      }).catch(function(error) {
           console.log(error.message)
      });
   }}

   // control camera

  make_control_panel()
    {
      this.key_triggered_button( "Move",[ "ArrowUp" ],        () => this.move=true,   Color.of(0, 1, 1, 1) ,() => this.move = false);
      this.key_triggered_button( "Down",   [ "ArrowDown" ], () => this.down=true, Color.of(0, 1, 1, 1) ,() => this.down = false );
      this.key_triggered_button( "Up",   [ " " ], () => this.up=true, Color.of(0, 1, 1, 1) ,() => this.up = false );
      this.key_triggered_button( "Left",   [ "ArrowLeft" ], () => this.left=true, Color.of(0, 1, 1, 1) ,() => this.left = false );
      this.key_triggered_button( "Right",  [ "ArrowRight" ],() => this.right=true,Color.of(0, 1, 1, 1) ,() => this.right = false );
      this.key_triggered_button( "Reverse",  [ "r" ],() => this.reverse = !this.reverse);
    }

// function that returns point to polygonise to decide which vertices to draw for marching cubes 

VertexInterp(p1, p2){

   var ret = [];

   ret[0] = (p1[0]+ p2[0])/2
   ret[1] = (p1[1]+p2[1])/2
   ret[2] = (p1[2]+p2[2])/2

   return ret;
}

hill(x, z){
   
   return -(Math.pow(0.2*(x+31), 2)) - (Math.pow(0.2*(z+29), 2)) + 30;
}


dot2(g, x, y){

     return g[0]*x + g[1]*y;
}

// implementation of perlin noise 

noise2D(x, y){

        // Find unit grid cell containing point
        var X = Math.floor(x) & 255;
        var Y = Math.floor(y) & 255;

        // Get relative xyz coordinates of point within that cell
        x = x - 95*x/100;
        y = y - 95*y/100;

        var fade = function(t) {
            return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
        };

        var lerp = function(a, b, t) {
            return (1.0-t)*a + t*b;
        }

        var u = fade(x),
            v = fade(y);

        // Calculate a set of four hashed gradient indices
        var n00 = perm[X   + perm[Y  ]] % 12;
        var n01 = perm[X   + perm[Y+1]] % 12;
        var n10 = perm[X+1 + perm[Y+1]] % 12;
        var n11 = perm[X+1 + perm[Y+1]] % 12;

        // Calculate noise contributions from each of the four corners
        var gi00 = this.dot2(grad3[n00], x,   y  );
        var gi01 = this.dot2(grad3[n01], x,   y-1);
        var gi10 = this.dot2(grad3[n10], x-1, y  );
        var gi11 = this.dot2(grad3[n11], x-1, y-1);

        // Interpolate the results along axises
        let ret = lerp(
            lerp(gi00, gi10, u),
            lerp(gi01, gi11, u),
        v);
        return ret;
    }

// marching cubes main function: decides which edges are being cut in the given grid cell, 
// and then decides which vertices to draw and pushes it to the Triangles array 

polygonise(GridCell, choice) {

    var cubeIndex = 0;
    var vertList = [];
    var check_y = 0;
    
    for(let i=0; i<8; i++) {

        if(choice == 0) {
            let GridCell_X = GridCell[i][0];
            let GridCell_Z = GridCell[i][2];

            if(GridCell_X < -5) {
              GridCell_X = (GridCell_X/50)*5;
            } 

            if(GridCell_X > 25) {
              GridCell_X = (GridCell_X/50)*25;
            }

            if(GridCell_Z < -5) {
              GridCell_Z = (GridCell_Z/50)*5;
            } 

            if(GridCell_Z > 25) {
                GridCell_Z = (GridCell_Z/50)*25;
            }

            check_y = this.noise2D(GridCell_X, GridCell_Z)*num_gridcells_y/10;

            if( check_y > GridCell[i][1]) {     
              cubeIndex |= Math.pow(2,i);
            }

        }

        if(choice == 1) {
          let y_hill_val = this.hill(GridCell[i][0], GridCell[i][2]);

            if( y_hill_val > GridCell[i][1]) 
            {
                cubeIndex |= Math.pow(2,i);
            }  
        }
    }

    // depending on which edges are cut, we send in a call to Vertex Interpolate 

    if(edgeTable[cubeIndex]==0) {
        return 0;
    }

    if(edgeTable[cubeIndex] & 1) {
        vertList[0] = this.VertexInterp(GridCell[0], GridCell[1]);
    }

    if(edgeTable[cubeIndex] & 2) {
        vertList[1] = this.VertexInterp(GridCell[1], GridCell[2]);
    }

    if(edgeTable[cubeIndex] & 4) {
        vertList[2] = this.VertexInterp(GridCell[2], GridCell[3]);
    }


    if(edgeTable[cubeIndex] & 8) {
        vertList[3] = this.VertexInterp(GridCell[3], GridCell[0]);
    }


    if(edgeTable[cubeIndex] & 16) {
        vertList[4] = this.VertexInterp(GridCell[4], GridCell[5]);
    }

    if(edgeTable[cubeIndex] & 32) {
        vertList[5] = this.VertexInterp(GridCell[5], GridCell[6]);
    }

    if(edgeTable[cubeIndex] & 64) {
        vertList[6] = this.VertexInterp(GridCell[6], GridCell[7]);
    }

    if(edgeTable[cubeIndex] & 128) {
        vertList[7] = this.VertexInterp(GridCell[7], GridCell[4]);
    }

    if(edgeTable[cubeIndex] & 256) {
        vertList[8] = this.VertexInterp(GridCell[0], GridCell[4]);
    }

    if(edgeTable[cubeIndex] & 512) {
        vertList[9] = this.VertexInterp(GridCell[1], GridCell[5]);
    }

    if(edgeTable[cubeIndex] & 1024) {
        vertList[10] = this.VertexInterp(GridCell[2], GridCell[6]);
    }

    if(edgeTable[cubeIndex] & 2048) {
      vertList[11] = this.VertexInterp(GridCell[3], GridCell[7]);
    }

  let i = 0;

  // pushes required vertices for the triangle to be drawn to an array Triangles 

  while(triTable[cubeIndex][i] != -1) {
     
     Triangles.push(vertList[triTable[cubeIndex][i]]);
     Triangles.push(vertList[triTable[cubeIndex][i+1]]);
     Triangles.push(vertList[triTable[cubeIndex][i+2]]);

     let coord1 = vertList[triTable[cubeIndex][i]];
     let coord2 = vertList[triTable[cubeIndex][i+1]];
     let coord3 = vertList[triTable[cubeIndex][i+2]];

     let a = [coord1[0] - coord2[0], coord1[1] - coord2[1], coord1[2] - coord2[2]];
     let b = [coord3[0] - coord2[0], coord3[1] - coord2[1], coord3[2] - coord2[2]];
     let c = [a[2]*b[1] - a[1]*b[2], a[0]*b[2] - a[2]*b[0], a[1]*b[0] - a[0]*b[1]];

     for(let m=0; m<3; m++) {
        Normals.push(c);
     }

     i += 3;
  }
}

display(context, program_state) {

    if(call_once==0){
          this.play_sound( "background" );
    }

    if( !context.scratchpad.controls ) {                      
         
          this.children.push( context.scratchpad.controls = new defs.Movement_Controls() );

          this.children.push( this.camera_teleporter = new Camera_Teleporter() );

          program_state.set_camera( Mat4.look_at( Vec.of( 0,0,-5 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) ) );
          this.initial_camera_location = program_state.camera_inverse;
          program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 200 );
     }

  // Find how much time has passed in seconds; we can use
  // time as an input when calculating new transforms:

    const t = program_state.animation_time / 2000;

    this.camera_teleporter.cameras = [];
    this.camera_teleporter.cameras.push( Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) ) );

    let model_transform = Mat4.identity();

    const modifier = this.lights_on ? { ambient: 0.3 } : { ambient: 0.0 };

    // implementation of lighting of scene and of lightning 

    const smoothly_varying_ratio = .5 + .5 * Math.sin( 2 * Math.PI * t/10 );
    const fast_varying_ratio = ( t%8 < 1 ) ? 2 * Math.sin(20 * Math.PI * t ) : 100,
          sun_size = 1 + 2 * fast_varying_ratio,
          sun = model_transform.times(Mat4.scale([sun_size, sun_size, sun_size])),
          sun_color = Color.of(0.3,0.8,1,1);

    program_state.lights = [new Light(Vec.of(-56,73,-58,1), sun_color, 10**(sun_size))];

    // initialises our marching cube shape (only once, after which it's stored in our
    // terrain object 

    if(call_once == 0){
          
        for(let i=0;i<num_gridcells_x*num_gridcells_y*num_gridcells_z;i++) {
            this.polygonise(Grid[i], 0);
          }

          for(let i=0;i<num_gridcells_x*num_gridcells_y*num_gridcells_z;i++) {
            this.polygonise(Grid[i], 1);
          }

          // constructor for our shape terrain, which takes in the array Triangles
          // that stores all our arrays

          this.shapes.terrain.setterFunc(Triangles,Normals);
          call_once++;
    }

    // main draw call!! draws our terrain 

    this.shapes.terrain.draw(context,program_state,Mat4.identity(),this.materials.plastic.override(modifier));

    // creates jagged object pieces that are placed around the scene

    let jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([-65,1,-12])).times(Mat4.scale([3,3,3])); 

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));

    
    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([-70,0,-50])).times(Mat4.scale([5,5,5])); 

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));

    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([5,0,-55])).times(Mat4.scale([6,6,6,])); 

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));
    
    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([-32,-1,7])).times(Mat4.scale([6,6,6,]));

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));

    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([43,0,-26])).times(Mat4.scale([3,3,3]));

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));

    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([-3,-1,-12])).times(Mat4.scale([6,6,6,]));

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));

    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([10,0,22])).times(Mat4.scale([3,3,3,]));

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));

    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([22,0,-13])).times(Mat4.scale([3,3,3,]));

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));

    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([-17,1,-64])).times(Mat4.scale([5,5,5,]));

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));

    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([-22,-1,20])).times(Mat4.scale([3,3,3,]));

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));
    
    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([-55,1,22])).times(Mat4.scale([3,3,3,]));

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));    

    jagged_transform = Mat4.identity();
    jagged_transform = jagged_transform.times(Mat4.translation([-52,1,-65])).times(Mat4.scale([6,6,6,]));

    this.shapes.jagged.draw(context, program_state, jagged_transform, this.materials.rock.override(modifier));    

    // creates random trees to be drawn around the scene

    let tree_matrix = Mat4.identity();
    tree_matrix = tree_matrix.times( Mat4.translation([14, 3, -15]))
                             .times( Mat4.scale( [2, 2, 2]));
                             
    this.shapes.tree.draw( context, program_state, tree_matrix, this.materials.dead_tree);

    tree_matrix = Mat4.identity();
    tree_matrix = tree_matrix.times(Mat4.translation([-60,4,-55])).times(Mat4.scale([2,2,2])); 

    this.shapes.tree.draw(context, program_state, tree_matrix, this.materials.dead_tree);

    tree_matrix = Mat4.identity();
    tree_matrix = tree_matrix.times(Mat4.translation([-5,5,-65])).times(Mat4.scale([3,3,3,])); 

    this.shapes.tree.draw(context, program_state, tree_matrix, this.materials.dead_tree);

    tree_matrix = Mat4.identity();
    tree_matrix = tree_matrix.times(Mat4.translation([33,3,-16])).times(Mat4.scale([2,2,2]));

    this.shapes.tree.draw(context, program_state, tree_matrix, this.materials.dead_tree);
 
    tree_matrix = Mat4.identity();
    tree_matrix = tree_matrix.times(Mat4.translation([3,3,12])).times(Mat4.scale([2,2,2,]));

    this.shapes.tree.draw(context, program_state, tree_matrix, this.materials.dead_tree);

    tree_matrix = Mat4.identity();
    tree_matrix = tree_matrix.times(Mat4.translation([-10,3,32])).times(Mat4.scale([3,3,3,]));

    this.shapes.tree.draw(context, program_state, tree_matrix, this.materials.dead_tree);

    tree_matrix = Mat4.identity();
    tree_matrix = tree_matrix.times(Mat4.translation([2,3,-23])).times(Mat4.scale([3,3,3,]));

    this.shapes.tree.draw(context, program_state, tree_matrix, this.materials.dead_tree);

    tree_matrix = Mat4.identity();
    tree_matrix = tree_matrix.times(Mat4.translation([-35,3,-61])).times(Mat4.scale([3,3,3,]));

    this.shapes.tree.draw(context, program_state, tree_matrix, this.materials.dead_tree);

    tree_matrix = Mat4.identity();
    tree_matrix = tree_matrix.times(Mat4.translation([-20,3,15])).times(Mat4.scale([2,2,2,]));

    this.shapes.tree.draw(context, program_state, tree_matrix, this.materials.dead_tree);

    tree_matrix = Mat4.identity();
    tree_matrix = tree_matrix.times(Mat4.translation([-50,3,15])).times(Mat4.scale([2,2,2,]));

    this.shapes.tree.draw(context, program_state, tree_matrix, this.materials.dead_tree);  

    Triangles = [];
    Normals = [];

    // bird implementation 

    if(this.up) {
        this.bird_transform = this.bird_transform.times( Mat4.translation([0, 0.1, 0]));
    }

    if(this.down) {
        this.bird_transform = this.bird_transform.times( Mat4.translation([0, -0.1, 0]));
    }

    if(this.move) {
        this.bird_transform = this.bird_transform.times( Mat4.translation([0, 0, 0.1]));
    }

    if(this.right) {
        this.bird_transform = this.bird_transform.times( Mat4.rotation(-0.05, Vec.of(0, 1, 0)));
    }

    if(this.left) {
        this.bird_transform = this.bird_transform.times( Mat4.rotation(0.05, Vec.of(0, 1, 0)));
    }

    if(this.reverse) {
        this.bird_transform = this.bird_transform.times( Mat4.rotation(Math.PI, Vec.of(0, 1, 0)));
        this.reverse = false;
    }

    this.shapes.obj.draw( context, program_state, this.bird_transform, this.materials.texture_bird);

    let x_pos = this.bird_transform[0][3];
    let y_pos = this.bird_transform[1][3];
    let z_pos = this.bird_transform[2][3];

    console.log(x_pos, y_pos, z_pos);

    if(Math.abs(x_pos) > num_gridcells_x/2)
    {
        this.bird_transform[0][3] = -x_pos;
    }

    if(Math.abs(z_pos) > num_gridcells_z/2)
    {
        this.bird_transform[2][3] = -z_pos;
    }

    // camera follows bird

    this.camera_teleporter.cameras.push( Mat4.inverse(this.bird_transform.times(Mat4.translation([0, 8, -8]))
    .times( Mat4.rotation( Math.PI, Vec.of(0, 1, 0)))
    .times( Mat4.rotation( Math.PI/7, Vec.of(-1, 0, 0)))));
}
}

const Additional_Scenes = [];

export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs }

const Camera_Teleporter = defs.Camera_Teleporter =
class Camera_Teleporter extends Scene
{      
  constructor()
    { super();
      this.cameras = [];
      this.selection = 1;
    }
  make_control_panel()
    {     
      this.key_triggered_button(  "Enable",       [ "e" ], () => this.enabled = false  );
      this.key_triggered_button( "Disable", [ "Shift", "E" ], () => this.enabled = true );
      this.new_line();
      this.key_triggered_button( "Previous location", [ "g" ], this.decrease );
      this.key_triggered_button(              "Next", [ "h" ], this.increase );
      this.new_line();
      this.live_string( box => { box.textContent = "Selected camera location: " + this.selection } );
    }
  increase() { this.selection = Math.min( this.selection + 1, Math.max( this.cameras.length-1, 0 ) ); }
  decrease() { this.selection = Math.max( this.selection - 1, 0 ); }   // Don't allow selection of negative indices.
  display( context, program_state )
  {
    const desired_camera = this.cameras[ this.selection ];
    if( !desired_camera || this.enabled )
      return;
    const dt = program_state.animation_delta_time;
    program_state.set_camera( desired_camera.map( (x,i) => Vec.from( program_state.camera_inverse[i] ).mix( x, .01*dt ) ) );    
  }
}