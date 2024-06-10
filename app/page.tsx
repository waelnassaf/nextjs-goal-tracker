import { goals } from "@/lib/data";

export default function Home() {
  const date = "5Y : 3M: 14D: 20H: 10M: 14S";

  return (
    <main>
      <section>
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-xl">
              <h1 className="text-5xl font-bold">End Date: June, 11, 2030</h1>
              <p className="text-4xl py-6">{date}</p>
              <button className="btn btn-primary">Edit Date</button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-md m-4 p-4 ">
        <h1 className="text-5xl max-w-xl">Goals</h1>
        {goals.map((goal) => (
          <div key={goal.title} className="my-4  p-3">
            <h2 className="text-3xl">{goal.title}</h2>
            <ul className="pl-4 text-2xl">
              {goal.goals.map((goalTitle, index) => (
                <li key={index}>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text"> {goalTitle}</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="checkbox"
                      />
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
