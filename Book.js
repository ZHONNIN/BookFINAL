class Book {
  constructor() {
    this.group = new THREE.Group();
    this.isOpen = false;
    this.currentPage = 0;
    this.totalPages = 12;
    this.animating = false;

    this.bookWidth = 3.0;
    this.bookHeight = 4.0;
    this.coverThickness = 0.06;
    this.pageBlockThickness = 0.05;
    this.spineWidth = this.coverThickness;

    this.coverFront = null;
    this.coverBack = null;
    this.spine = null;
    this.pagePairs = [];

    this.createBook();
  }

  createBook() {
    const coverMat = createCoverMaterial();
    const spineMat = createSpineMaterial();

    const coverGeo = new THREE.BoxGeometry(this.bookWidth, this.bookHeight, this.coverThickness);

    // Front cover with pivot at spine
    const coverFrontPivot = new THREE.Group();
    coverFrontPivot.position.set(-this.bookWidth / 2, 0, 0);

    this.coverFront = new THREE.Mesh(coverGeo, coverMat);
    this.coverFront.position.set(this.bookWidth / 2, 0, this.coverThickness / 2);
    this.coverFront.castShadow = true;
    this.coverFront.receiveShadow = true;

    coverFrontPivot.add(this.coverFront);
    this.coverFrontPivot = coverFrontPivot;
    this.group.add(coverFrontPivot);

    // Back cover with pivot at spine
    const coverBackPivot = new THREE.Group();
    coverBackPivot.position.set(-this.bookWidth / 2, 0, 0);

    this.coverBack = new THREE.Mesh(coverGeo, coverMat.clone());
    this.coverBack.position.set(this.bookWidth / 2, 0, -this.coverThickness / 2);
    this.coverBack.castShadow = true;
    this.coverBack.receiveShadow = true;

    coverBackPivot.add(this.coverBack);
    this.coverBackPivot = coverBackPivot;
    this.group.add(coverBackPivot);

    // Spine - connecting covers at the left edge
    const spineGeo = new THREE.BoxGeometry(this.spineWidth, this.bookHeight, this.coverThickness);
    this.spine = new THREE.Mesh(spineGeo, spineMat);
    this.spine.position.set(-this.bookWidth / 2 + this.spineWidth / 2, 0, 0);
    this.spine.castShadow = true;
    this.spine.receiveShadow = true;
    this.group.add(this.spine);

    // Create page pairs
    const pageGeo = new THREE.BoxGeometry(this.bookWidth, this.bookHeight, 0.002, 20, 20, 1);
    const offsetRange = this.coverThickness * 0.8;

    for (let i = 0; i < this.totalPages; i++) {
      const shaderMat = createShaderPageMaterial();
      const rightPage = new THREE.Mesh(pageGeo, shaderMat);

      const offset = (i / this.totalPages) * offsetRange - offsetRange / 2;

      rightPage.castShadow = true;
      rightPage.receiveShadow = true;

      const pagePivot = new THREE.Group();
      pagePivot.position.set(-this.bookWidth / 2, 0, offset);
      rightPage.position.set(0, 0, 0);
      pagePivot.add(rightPage);

      this.pagePairs.push({
        pivot: pagePivot,
        rightPage: rightPage,
        material: shaderMat
      });

      this.group.add(pagePivot);
    }

    this.group.position.y = this.bookHeight / 2;
    this.group.rotation.y = Math.PI / 6;
  }

  openBook() {
    if (this.animating || this.isOpen) return;
    this.animating = true;

    gsap.to(this.coverFrontPivot.rotation, {
      y: -2.6,
      duration: 1.2,
      ease: "back.out(1.2)",
      onComplete: () => {
        this.isOpen = true;
        this.animating = false;
      }
    });
  }

  closeBook() {
    if (this.animating || !this.isOpen) return;
    this.animating = true;

    gsap.to(this.coverFrontPivot.rotation, {
      y: 0,
      duration: 1.0,
      ease: "power2.inOut",
      onComplete: () => {
        this.isOpen = false;
        this.animating = false;
      }
    });

    this.pagePairs.forEach((pairObj, i) => {
      if (i < this.currentPage) {
        gsap.to(pairObj.pivot.rotation, {
          y: 0,
          duration: 0.8,
          ease: "power2.inOut"
        });
        gsap.to(pairObj.material.uniforms.uBendAmount, {
          value: 0,
          duration: 0.8
        });
        gsap.to(pairObj.material.uniforms.uFlipProgress, {
          value: 0,
          duration: 0.8
        });
      }
    });

    this.currentPage = 0;
  }

  flipForward() {
    if (this.animating || !this.isOpen || this.currentPage >= this.totalPages) return;
    this.animating = true;

    const pairObj = this.pagePairs[this.currentPage];

    gsap.to(pairObj.material.uniforms.uBendAmount, {
      value: 1.0,
      duration: 0.45,
      ease: "power1.inOut"
    });

    gsap.to(pairObj.material.uniforms.uFlipProgress, {
      value: 1.0,
      duration: 0.9,
      ease: "power2.inOut"
    });

    gsap.to(pairObj.pivot.rotation, {
      y: -Math.PI,
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(pairObj.material.uniforms.uBendAmount, {
          value: 0,
          duration: 0.3
        });
        this.currentPage++;
        this.animating = false;
      }
    });
  }

  flipBackward() {
    if (this.animating || !this.isOpen || this.currentPage <= 0) return;
    this.animating = true;

    this.currentPage--;
    const pairObj = this.pagePairs[this.currentPage];

    gsap.to(pairObj.material.uniforms.uBendAmount, {
      value: 1.0,
      duration: 0.45,
      ease: "power1.inOut"
    });

    gsap.to(pairObj.material.uniforms.uFlipProgress, {
      value: 0.5,
      duration: 0.9,
      ease: "power2.inOut"
    });

    gsap.to(pairObj.pivot.rotation, {
      y: 0,
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(pairObj.material.uniforms.uBendAmount, {
          value: 0,
          duration: 0.3
        });
        gsap.to(pairObj.material.uniforms.uFlipProgress, {
          value: 0,
          duration: 0.3
        });
        this.animating = false;
      }
    });
  }
}
