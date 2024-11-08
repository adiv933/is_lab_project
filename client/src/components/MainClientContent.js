import { Account } from './Account';

export const MainClientContent = props => {
  const { user } = props;

  return (
    <section id="main-content">
      <h1 className="main">My Account</h1>
      <Account type={user.type} accountNumber={user.number} balance={user.balance} fullname={user.fullname} />
      <div id="transactions">
        <h2>Transactions</h2>
        <div id="transaction-div">

          {user.transactions.map((transaction, index) => {
            const className = index % 2 === 0 ? 'even' : 'odd';
            return (
              <div key={index} className={`transaction-item ${className}`}>
                {transaction}
              </div>)

          })}
        </div>
      </div>
    </section>
  )
}