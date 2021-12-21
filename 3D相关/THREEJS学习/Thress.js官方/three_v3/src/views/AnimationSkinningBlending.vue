<template>
  <div class="container">

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import Stats from 'stats.js'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const initWebGLHook = () => {
  const container = document.querySelector('.container')
  // stats
  const stats = new Stats()
  // renderer
  const renderer = new THREE.WebGL1Renderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true

  if (container) {
    container.appendChild(stats.dom)
    container.appendChild(renderer.domElement)
  }
  // scene
  const scene = initScene()
  // camera
  const camera = initCamera()
  // resize
  window.addEventListener('resize', handleResize)
  function handleResize () {
    // update camera render
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  let mixer: THREE.AnimationMixer
  // animate
  const clock = new THREE.Clock()
  function aniamte () {
    requestAnimationFrame(aniamte)
    const delta = clock.getDelta()
    if (mixer) {
      mixer.update(delta)
    }
    stats.update()
    renderer.render(scene, camera)
  }
  // loader
  const loader = new GLTFLoader()
  loader.loadAsync('/model/gltf/Soldier.glb')
    .then(gltf => {
      const model = gltf.scene
      console.log(model)
      model.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.castShadow = true
        }
      })
      scene.add(model)

      // 骨架
      const skeleton = new THREE.SkeletonHelper(model)
      scene.add(skeleton)

      // animations
      const animations = gltf.animations
      mixer = new THREE.AnimationMixer(model)

      const idleAction = mixer.clipAction(animations[0])
      const walkAction = mixer.clipAction(animations[3])
      const runAction = mixer.clipAction(animations[1])

      const actions = [idleAction, walkAction, runAction]

      activateAllActions()
      function activateAllActions () {
        actions.forEach(action => {
          action.play()
        })
      }

      aniamte()
    })
}
const initScene = () => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xa0a0a0)
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50)

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
  hemiLight.position.set(0, 20, 0)
  scene.add(hemiLight)

  const dirLight = new THREE.DirectionalLight(0xffffff)
  dirLight.position.set(-3, 10, -10)
  dirLight.castShadow = true
  dirLight.shadow.camera.top = 2
  dirLight.shadow.camera.bottom = -2
  dirLight.shadow.camera.left = -2
  dirLight.shadow.camera.right = 2
  dirLight.shadow.camera.near = 0.1
  dirLight.shadow.camera.far = 40
  scene.add(dirLight)

  // scene.add(new THREE.CameraHelper(dirLight.shadow.camera))

  const mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.receiveShadow = true
  scene.add(mesh)
  return scene
}
const initCamera = () => {
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(1, 2, -3)
  camera.lookAt(0, 1, 0)
  return camera
}

export default defineComponent({
  name: 'AnimationSkinningBlending',
  setup () {
    onMounted(() => {
      initWebGLHook()
    })
    return {}
  }
})
</script>
