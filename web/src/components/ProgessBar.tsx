export interface ProgessBarProps {
  progress: number
}

export function ProgessBar({ progress }: ProgessBarProps) {
  return (
    <div
      className="h-3 rounded-xl bg-zinc-700 w-full mt-4"
      role="progressbar"
      aria-label="Progresso de hábitos completadors nesse dia"
      aria-valuenow={progress}
      aria-valuemax={100}
      aria-valuemin={0}
    >
      <div
        className="h-3 rounded-xl bg-violet-600 transition-all"
        style={{
          width: `${progress}%`
        }}
      ></div>
    </div>
  )
}
