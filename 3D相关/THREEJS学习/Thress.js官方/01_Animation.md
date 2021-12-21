### Keyframes

预编译环境贴图 

```js
import { RoomEnvironment } from 'three/examples/jsm/enviroments/RoomEnvironment'

const pmremGenerator = new THREE.PMEREMGenerator(renderer)
const scene = new THREE.Scene()
scene.environment = pmremGenerator.formScene(new RoomEnvironment(), 0.04).textrue
```

生成动画

```js
let mixer
gltfLoader.loadAsync('../xx.glb')
	.then(gltf => {
 	//...
  mixer = new THREE.AnimationMixer(gltf.scene)
  const antion = mixer.clipAction(gltf.animations[0])
  antion.play()
})

// animate
const clock = new THREE.Clock()
function animate () {
  //...
  const delta = clock.getDelta()
  mixer.update(delta)
}
```

