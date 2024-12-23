import { stepsData } from "../assets/assets.js"

const Steps = () => {
	return (
		<div className="flex flex-col items-center justify-center my-32">
			<h1 className="text-3xl sm:text-4xl font-semibold mb-2">How it works</h1>
			<p className="text-lg text-gray-600 mb-8">Transform Words Into Stunning Images</p>
			<div className="space-y-4 w-full max-w-3xl text-sm">
				{stepsData.map((item, index)=>(
					<div key={index} className="flex gap-4 p-5 px8 bg-white/20 shadow-md border cursor-pointer hover:scale-105 transition-all duration-300 rounded-lg">
						<img src={item.icon} alt={item.title} className="w-16 h-16" />
						<div>
							<h2 className="text-xl font-medium text-gray-800">{item.title}</h2>
							<p className=" text-gray-600">{item.description}</p>
						</div>
					</div>
					)
				)}
			</div>
		</div>
	)
}

export default Steps