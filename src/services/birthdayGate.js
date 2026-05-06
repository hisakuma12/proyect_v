export const UNLOCK_AT = new Date("2026-04-08T00:00:00-04:00");

export function isBirthdayUnlocked(now = new Date()) {
	return now.getTime() >= UNLOCK_AT.getTime();
}

export function getCountdownParts(now = new Date()) {
	const diff = Math.max(UNLOCK_AT.getTime() - now.getTime(), 0);
	const seconds = Math.floor(diff / 1000);

	return {
		dias: Math.floor(seconds / 86400),
		horas: Math.floor((seconds % 86400) / 3600),
		minutos: Math.floor((seconds % 3600) / 60),
		segundos: seconds % 60,
	};
}
