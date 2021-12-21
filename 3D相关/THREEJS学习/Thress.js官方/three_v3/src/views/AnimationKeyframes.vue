<template>
  <div class="container">

  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import Stats from 'stats.js'

const initWebGLHook = function () {
  const container = document.querySelector('.container')

  const stats = new Stats()
  container.appendChild(stats.dom)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelratio = window.devicePixelRatio
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.ouputEncoding = THREE.sRGBEncoding
  container.appendChild(renderer.domElement)

  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xbfe3dd)
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.01).texture

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.04, 100)
  camera.position.set(5, 3, 8)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.enableDamping = true
  controls.target.set(0, 0.5, 0)
  controls.update()

  window.addEventListener('resize', onWindowResize)
  function onWindowResize () {
    // update camera renderer
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  // loader
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')
  const gltfLoader = new GLTFLoader()
  gltfLoader.setDRACOLoader(dracoLoader)

  let mixer
  gltfLoader.loadAsync('/model/gltf/LittlestTokyo.glb')
    .then(gltf => {
      console.log(gltf)
      const model = gltf.scene
      model.position.set(1, 1, 0)
      model.scale.set(0.01, 0.01, 0.01)
      scene.add(model)

      mixer = new THREE.AnimationMixer(model)
      mixer.clipAction(gltf.animations[0]).play()

      animate()
    })
  const clock = new THREE.Clock()
  function animate () {
    requestAnimationFrame(animate)
    const delta = clock.getDelta()
    mixer.update(delta)
    controls.update()
    renderer.render(scene, camera)
  }
}
export default defineComponent({
  name: 'AnimationKeyframes',
  setup () {
    onMounted(() => {
      initWebGLHook()
    })
    return {}
  }
})
</script>
