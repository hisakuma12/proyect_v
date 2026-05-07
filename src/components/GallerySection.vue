<script setup>
	import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-vue-next";
	import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
	import { gsap } from "gsap";

	const props = defineProps({
		photos: {
			type: Array,
			required: true,
		},
	});

	const selectedPhoto = ref(null);
	const prefersReducedMotion = () =>
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const selectedPhotoIndex = computed(() => {
		if (!selectedPhoto.value) return -1;
		return props.photos.findIndex(
			(photo) => photo.id === selectedPhoto.value.id,
		);
	});

	const openPhoto = async (photo) => {
		selectedPhoto.value = photo;
		await nextTick();

		if (prefersReducedMotion()) return;

		gsap.fromTo(
			".gallery-modal",
			{ autoAlpha: 0 },
			{ autoAlpha: 1, duration: 0.2, ease: "power2.out" },
		);
		gsap.fromTo(
			".modal-photo",
			{ autoAlpha: 0, y: 14, scale: 0.985, filter: "blur(8px)" },
			{
				autoAlpha: 1,
				y: 0,
				scale: 1,
				filter: "blur(0px)",
				duration: 0.42,
				ease: "power2.out",
			},
		);
		gsap.fromTo(
			".modal-photo figcaption, .gallery-modal .modal-button",
			{ autoAlpha: 0, y: 10 },
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.28,
				ease: "power2.out",
				stagger: 0.035,
				delay: 0.08,
			},
		);
	};

	const closePhoto = async () => {
		if (!selectedPhoto.value) return;

		if (prefersReducedMotion()) {
			selectedPhoto.value = null;
			return;
		}

		await new Promise((resolve) => {
			gsap.to(".gallery-modal", {
				autoAlpha: 0,
				duration: 0.18,
				ease: "power2.in",
				onComplete: resolve,
			});
		});
		selectedPhoto.value = null;
	};

	const movePhoto = async (direction) => {
		if (!selectedPhoto.value) return;

		const currentIndex = props.photos.findIndex(
			(photo) => photo.id === selectedPhoto.value.id,
		);
		const nextIndex =
			(currentIndex + direction + props.photos.length) %
			props.photos.length;
		const nextPhoto = props.photos[nextIndex];

		selectedPhoto.value = nextPhoto;

		await nextTick();
		if (prefersReducedMotion()) return;

		gsap.fromTo(
			".modal-photo-frame img, .modal-photo figcaption",
			{ autoAlpha: 0, y: 8, filter: "blur(6px)" },
			{
				autoAlpha: 1,
				y: 0,
				filter: "blur(0px)",
				duration: 0.32,
				ease: "power2.out",
			},
		);
	};

	const handleKeydown = (event) => {
		if (!selectedPhoto.value) return;

		if (event.key === "Escape") closePhoto();
		if (event.key === "ArrowRight") movePhoto(1);
		if (event.key === "ArrowLeft") movePhoto(-1);
	};

	onMounted(() => {
		window.addEventListener("keydown", handleKeydown);
	});

	onBeforeUnmount(() => {
		window.removeEventListener("keydown", handleKeydown);
	});
</script>

<template>
	<section id="galeria" class="section-block gallery-section">
		<div class="section-inner">
			<div class="section-heading" data-reveal>
				<span class="eyebrow">Recuerdos</span>
				<h2>Una galería para volver a sonreír</h2>
				<p>
					Tocá cualquier foto para verla con calma y pasar de un
					recuerdo a otro.
				</p>
			</div>

			<div class="gallery-grid">
				<button
					v-for="(photo, index) in photos"
					:key="photo.id"
					class="gallery-card"
					:class="{
						'has-soft-frame': true,
						'is-portrait': photo.frame === 'portrait',
					}"
					type="button"
					data-reveal
					:aria-label="`Abrir recuerdo: ${photo.title}`"
					:style="{
						'--delay': `${index * 70}ms`,
						'--photo-bg': `url(${photo.thumb || photo.image})`,
					}"
					@click="openPhoto(photo)"
				>
					<div class="gallery-photo-frame photo-frame">
						<img
							:src="photo.thumb || photo.image"
							:alt="photo.alt || photo.title"
							loading="lazy"
							:style="{
								objectFit: photo.objectFit || 'contain',
								objectPosition:
									photo.objectPosition || 'center',
							}"
						/>
					</div>
					<span class="gallery-open-indicator" aria-hidden="true">
						<Maximize2 :size="18" />
					</span>
					<span class="gallery-card-copy">
						<strong class="gallery-card-title">{{
							photo.title
						}}</strong>
						<span class="gallery-card-phrase">{{
							photo.phrase
						}}</span>
					</span>
				</button>
			</div>
		</div>

		<Teleport to="body">
			<div
				v-if="selectedPhoto"
				class="gallery-modal"
				role="dialog"
				aria-modal="true"
				:aria-label="selectedPhoto.title"
				@click.self="closePhoto"
			>
				<div class="gallery-modal-toolbar">
					<span>{{ selectedPhotoIndex + 1 }} de {{ photos.length }}</span>
					<button
						class="modal-button modal-close"
						type="button"
						aria-label="Cerrar imagen"
						title="Cerrar imagen"
						@click="closePhoto"
					>
						<X :size="22" aria-hidden="true" />
					</button>
				</div>

				<button
					class="modal-button modal-prev"
					type="button"
					aria-label="Imagen anterior"
					title="Imagen anterior"
					@click="movePhoto(-1)"
				>
					<ChevronLeft :size="28" aria-hidden="true" />
				</button>

				<figure
					class="modal-photo"
					:class="{
						'has-soft-frame': true,
						'is-portrait': selectedPhoto.frame === 'portrait',
					}"
					:style="{
						'--photo-bg': `url(${selectedPhoto.thumb || selectedPhoto.image})`,
					}"
				>
					<div class="modal-photo-frame photo-frame">
						<img
							:src="selectedPhoto.image"
							:alt="selectedPhoto.alt || selectedPhoto.title"
							:style="{
								objectFit: selectedPhoto.objectFit || 'contain',
								objectPosition: 'center center',
							}"
						/>
					</div>
					<figcaption>
						<span class="modal-counter">
							{{ selectedPhotoIndex + 1 }} / {{ photos.length }}
						</span>
						<strong>{{ selectedPhoto.title }}</strong>
						<span class="modal-phrase">{{
							selectedPhoto.phrase
						}}</span>
					</figcaption>
				</figure>

				<button
					class="modal-button modal-next"
					type="button"
					aria-label="Imagen siguiente"
					title="Imagen siguiente"
					@click="movePhoto(1)"
				>
					<ChevronRight :size="28" aria-hidden="true" />
				</button>
			</div>
		</Teleport>
	</section>
</template>
