export function LeaderBoard() {
    return (
        <div className="w-full">
            <div className="flex items-center p-4 justify-between w-full border-b">
            <h2 className="font-semibold  text-base sm:text-xl">
        LeaderBoard
      </h2> 
            </div>
            <div className="font-semibold text-sm w-full grid grid-cols-2 gap-2 bg-gray-200 px-4 py-3">
                <p>Name</p>
                <p>Total</p>
            </div>
            
           
        </div>
    )
}