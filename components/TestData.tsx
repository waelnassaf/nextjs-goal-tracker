import { getFullUserData } from "@/server/actions";

const TestData = async () => {
  const userData = await getFullUserData("666980120b5c919fd83b6b1d");

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Data</h1>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <p>
        Goals End Date: {new Date(userData.goalsEndDate).toLocaleDateString()}
      </p>

      <h2>Categories</h2>
      {userData.categories.map((category) => (
        <div key={category._id}>
          <h3>{category.name}</h3>
          <p>Order: {category.order}</p>
          <h4>Goals</h4>
          <ul>
            {category.goals.map((goal) => (
              <li key={goal._id}>
                {goal.name} - {goal.complete ? "Complete" : "Incomplete"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TestData;
