<script lang="ts">
	import { getStatusBadge } from '$lib/utils/format';

	interface Props {
		status: string;
		label?: string;
		className?: string;
	}

	let { status, label, className = '' }: Props = $props();

	let badgeInfo = $derived(getStatusBadge(status));
</script>

<span
	class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-all {badgeInfo.classes} {className}"
>
	{label || badgeInfo.label}
</span>
