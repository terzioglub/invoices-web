import { createCustomer } from "../actions";

export default function NewCustomerPage() {
  return (
    <>
      <div className="page-header">
        <h1>New customer</h1>
      </div>
      <form action={createCustomer} className="card form">
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Company
          <input name="company" placeholder="Optional" />
        </label>
        <button>Create customer</button>
      </form>
    </>
  );
}
