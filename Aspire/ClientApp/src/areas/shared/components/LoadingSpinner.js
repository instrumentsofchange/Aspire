import React from 'react'
import BounceLoader from 'react-spinners/BounceLoader'

export default props => {
	const { color, size, text, noCenter } = props

	let loadingColor = colorsMap.get('primary')

	if (color) {
		const tryGetColor = colorsMap.get(color)

		loadingColor = tryGetColor ? tryGetColor : loadingColor
	}

	const sizeToUse = size || 150

	const getFontSizeClass = () => {
		let className

		switch (sizeToUse) {
			case sizeToUse < 50:
				className = 'size-under-50'
				break

			case sizeToUse >= 50 && sizeToUse < 100:
				className = 'size-50-100'
				break

			case sizeToUse >= 100 && sizeToUse < 150:
				className = 'size-100-150'
				break

			case sizeToUse >= 150:
			default:
				className = 'size-over-150'
		}

		return className
	}

	const loader = (
		<BounceLoader 
			color={loadingColor}
			size={sizeToUse}
		/>
	)

	return (
		<div className="container">
			{
				noCenter 
				? loader
				: <div className="row justify-content-center">
						{loader}
					</div>
			}

			<div className={`row mt-3 ${noCenter ? '' : 'justify-content-center'} ${getFontSizeClass()}`}>
				<span style={{ color: `${loadingColor}`}}>{text || 'Loading...'}</span>
			</div>
		</div>
	);
}

const colorsMap = new Map([
	['success', '#d4edda'],
	['primary', '#379683']
])