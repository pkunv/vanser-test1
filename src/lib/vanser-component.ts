export function VanserComponent(componentName: string, props: any) {
	return {
		vanser: true,
		componentName,
		hydrationdata: JSON.stringify(props),
	}
}
