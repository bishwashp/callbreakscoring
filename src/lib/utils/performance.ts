/**
 * Performance detection utility for optimizing animations on low-end devices
 */

/**
 * Detects if the device is considered low-end based on hardware capabilities
 * Uses navigator.hardwareConcurrency (CPU cores) as the primary indicator
 * Devices with <=4 cores are considered low-end
 */
export function isLowEndDevice(): boolean {
  // Check if hardwareConcurrency is available
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
    // Consider devices with 4 or fewer CPU cores as low-end
    return navigator.hardwareConcurrency <= 4;
  }
  
  // Fallback: if hardwareConcurrency is not available, assume mid-range device
  return false;
}

/**
 * React hook for detecting device performance capability
 * Returns true if device is low-end (should use reduced animations)
 */
export function useReducedMotion(): boolean {
  // Check for user's reduced motion preference first
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return true;
    }
  }
  
  // Then check device performance
  return isLowEndDevice();
}

/**
 * Get animation config based on device performance
 * Returns simplified config for low-end devices
 */
export function getAnimationConfig(isLowEnd: boolean) {
  if (isLowEnd) {
    return {
      // Simplified transitions
      spring: {
        type: "tween" as const,
        duration: 0.2,
      },
      // Reduce delays
      staggerDelay: 0.05,
      // Disable decorative effects
      enableParticles: false,
      enableComplexAnimations: false,
    };
  }
  
  return {
    // Full animations
    spring: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
    staggerDelay: 0.1,
    enableParticles: true,
    enableComplexAnimations: true,
  };
}