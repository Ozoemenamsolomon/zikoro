"use client"

import { Switch } from "@/components/ui/switch"
import { useUpdateQuiz } from "@/hooks"
import { TQuestion, TQuiz } from "@/types"

export function ActivateQuiz({quiz, refetch}:{refetch: () => Promise<any>; quiz: TQuiz<TQuestion[]>}) {
    const {updateQuiz, isLoading}  = useUpdateQuiz()
    async function updateStatus() {
        const payload: Partial<TQuiz<TQuestion[]>> = {
            ...quiz,
           accessibility: {
            ...quiz?.accessibility,
            disable:!quiz.accessibility?.disable,

           }
            
        }

      await  updateQuiz({payload})
        refetch()
    }
    return (
        <>
         <div className="w-full px-4 text-xs flex items-center justify-between ">
            <p>Activate</p>
            <Switch
            onClick={updateStatus}
            checked={!quiz.accessibility?.disable}
            disabled={isLoading} className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary" />
          </div>
        </>
    )
}