import * as THREE from "three";

export type OnFinished = () => void;

export class ScaleAnimator {
  private meshes: THREE.Mesh[] = [];
  private mdfMeshes: THREE.Mesh[] = [];
  private target = new THREE.Vector3(1, 1, 1);
  private smoothing = 0.12;
  private epsilon = 1e-6;
  private onFinished: OnFinished | null = null;

  constructor(smoothing = 0.12) {
    this.smoothing = smoothing;
  }

  setMeshes(meshes: THREE.Mesh[], mdfMeshes: THREE.Mesh[] = []) {
    this.meshes = meshes;
    this.mdfMeshes = mdfMeshes;
  }

  setTarget(target: THREE.Vector3) {
    this.target.copy(target);
  }

  setOnFinished(cb: OnFinished | null) {
    this.onFinished = cb;
  }

  update(): boolean {
    let allAtTarget = true;
    const t = this.smoothing;

    for (const m of this.meshes) {
      m.scale.lerp(this.target, t);
      if (m.scale.distanceToSquared(this.target) > this.epsilon)
        allAtTarget = false;
    }

    for (const m of this.mdfMeshes) {
      m.scale.lerp(this.target, t);
      if (m.scale.distanceToSquared(this.target) > this.epsilon)
        allAtTarget = false;
    }

    if (allAtTarget) {
      if (this.onFinished) this.onFinished();
    }

    return allAtTarget;
  }
}

export default ScaleAnimator;
