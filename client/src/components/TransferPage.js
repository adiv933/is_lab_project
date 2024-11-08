// import { useState } from "react";
// import { Notif } from "./Notif";
// import { formatNumber, getDateToday } from "./Utils";

// export const TransferPage = (props) => {
//     const {isClient, client, setClient} = props;
//     const [users, setUsers] = useState(props.users); 
//     const [receivers, setReceivers] = useState(users);
//     const [sender, setSender] = useState( isClient ? client : {balance: 0});
//     const [receiver, setReceiver] = useState({balance: 0});
//     const [notif, setNotif] = useState({message: 'Transfer money from one account to another.', style: 'left'});
//     const [transferAmount, setTransferAmount] = useState(0);

//     const senderSelected = (event) => {
//         const accountNumber = event.target.value;

//         let sender = null; 

//         users.forEach(user => {
//             if(user.number === accountNumber) {
//                 sender = user;        
//             }
//         })

//         const newUsers = users.filter((user, index) => {
//             return user.number !== accountNumber;
//         });

//         setSender(sender);
//         setReceivers(newUsers);
//         setReceiver({number: 0, balance: 0});
//     }

//     const receiverSelected = event => {
//         const accountNumber = event.target.value;

//         let receiver = null;

//         users.forEach(user => {
//             if(user.number === accountNumber) {
//                 receiver = user;
//             }
//         })

//         setReceiver(receiver);
//     }

//     let senders = null;
//     if(!isClient) {
//         senders = users.map(user => {
//             return (
//                 <option value={user.number}>{user.fullname} #{user.number}</option>
//             )
//         });
//     }

//     const newReceivers = receivers.map(receiver => {
//         if(sender.number !== receiver.number) {
//             return (
//                 <option value={receiver.number}>{receiver.fullname} #{receiver.number}</option>
//             )
//         }

//     })

//     const transferFund = event => {
//         event.preventDefault();
//         const amount = parseFloat(event.target.elements.amount.value.replace(/,/g, ''));
//         if(amount <= 0) return false;

//         // get localstorage users
//         const users = JSON.parse(localStorage.getItem('users'));

//         if(sender.number !== 0 && receiver.number !== 0 && receiver.number) {
//             // deduct from sender
//             let senderSuccess = false;
//             users.forEach(user => {
//                 if(user.number === sender.number) {
//                     if(user.balance - amount >= 0) {
//                         user.balance -= amount;

//                         const transDate = new Date();
//                         console.log(user.transactions);
//                         user.transactions.unshift({
//                             title: `Fund transfer to ${receiver.fullname} #${receiver.number}`, 
//                             amount: amount, 
//                             type: "debit", 
//                             date: getDateToday()
//                         });

//                         setSender(user);
//                         senderSuccess = true;

//                     }
//                 }
//             });

//             // add to receiver 
//             if(senderSuccess) {
//                 users.forEach(user => {
//                     if(user.number === receiver.number) {
//                         user.balance += amount;

//                         user.transactions.unshift({
//                             title: `Fund transfer from ${sender.fullname} #${receiver.number}`, 
//                             amount: amount, 
//                             type: "credit", 
//                             date: getDateToday()
//                         });

//                         setReceiver(user);
//                     }
//                 });

//                 setNotif({ message: 'Successful transfer.', style: 'success' });
//                 setUsers(users);
//                 props.setUsers(users);
//                 localStorage.setItem('users', JSON.stringify(users));
//                 setTransferAmount(0);
//             } 
//             else {
//                 setNotif({message: 'Transfer failed.', style: 'danger'});
//             }
//         }
//         else {
//             setNotif({message: 'Incomplete information. Missing sender or receiver.', style: 'danger' });
//         }
//     }

//     const onTransfer = (e) => {
//         const transfer = parseFloat(e.target.value.replace(/,/g, '')) || 0;
//         setTransferAmount(transfer);
//     }

//     let senderField = 
//         <select onChange={senderSelected} name="sender">
//             <option>Select Sender</option>
//             {senders}
//         </select>;

//     if(isClient) {
//         senderField = <input type="text" name="sender" value={`${client.fullname} #${client.number}`} disabled />
//     }

//     return (
//         <section id="main-content">
//             <form id="form" onSubmit={transferFund}>
//                 <h1>Fund Transfer</h1>

//                 <Notif message={notif.message} style={notif.style} />
//                 <h2>Sender</h2>
//                 <label>From (Sender)</label>
//                 {senderField}

//                 <label>Current balance</label>
//                 <input type="text" className="right" value={formatNumber(sender.balance)} disabled />

//                 <label>Amount to Transfer</label>
//                 <input type="text" name="amount" value={formatNumber(transferAmount)} onChange={onTransfer} autoComplete="off" className="right big-input" />

//                 <div className="transfer-icon"><i className='bx bx-down-arrow-alt'></i></div>
//                 <h2>Receiver</h2>
//                 <label>To (Receiver)</label>
//                 <select value={receiver.number || 0} onChange={receiverSelected} name="receiver">
//                     <option>Select Receiver</option>
//                     {newReceivers}
//                 </select>
//                 <label>Current balance</label>
//                 <input type="text" className="right" value={formatNumber(receiver.balance)} disabled />
//                 <input type="submit" className="btn" value="Transfer Fund" />
//             </form>
//         </section>
//     )
// }

// import { useState, useEffect } from "react";
// import { Notif } from "./Notif";
// import { formatNumber, getDateToday } from "./Utils";

// export const TransferPage = (props) => {
//     const { isClient, client, setClient } = props;
//     const [users, setUsers] = useState(props.users);
//     const [receivers, setReceivers] = useState(props.users);
//     const [sender, setSender] = useState(isClient ? client : { balance: 0 });
//     const [receiver, setReceiver] = useState({ balance: 0 });
//     const [notif, setNotif] = useState({ message: 'Transfer money from one account to another.', style: 'left' });
//     const [transferAmount, setTransferAmount] = useState(0);

//     // Synchronize the local users state with the props.users
//     useEffect(() => {
//         setUsers(props.users);
//         setReceivers(props.users);
//     }, [props.users]);

//     const senderSelected = (event) => {
//         const accountNumber = event.target.value;

//         let sender = null;

//         users.forEach(user => {
//             if (user.number === accountNumber) {
//                 sender = user;
//             }
//         });

//         const newUsers = users.filter((user, index) => {
//             return user.number !== accountNumber;
//         });

//         setSender(sender);
//         setReceivers(newUsers);
//         setReceiver({ number: 0, balance: 0 });
//     }

//     const receiverSelected = event => {
//         const accountNumber = event.target.value;

//         let receiver = null;

//         users.forEach(user => {
//             if (user.number === accountNumber) {
//                 receiver = user;
//             }
//         });

//         setReceiver(receiver);
//     }

//     let senders = null;
//     if (!isClient) {
//         senders = users.map(user => {
//             return (
//                 <option value={user.number} key={user.number}>{user.fullname} #{user.number}</option>
//             )
//         });
//     }

//     const newReceivers = receivers.map(receiver => {
//         if (sender.number !== receiver.number) {
//             return (
//                 <option value={receiver.number} key={receiver.number}>{receiver.fullname} #{receiver.number}</option>
//             )
//         }
//     });

//     const transferFund = event => {
//         event.preventDefault();
//         const amount = parseFloat(event.target.elements.amount.value.replace(/,/g, ''));
//         if (amount <= 0) return false;

//         // get localstorage users

//         if (sender.number !== 0 && receiver.number !== 0 && receiver.number) {
//             // deduct from sender
//             let senderSuccess = false;
//             users.forEach(user => {
//                 if (user.number === sender.number) {
//                     if (user.balance - amount >= 0) {
//                         user.balance -= amount;

//                         const transDate = new Date();
//                         console.log(user.transactions);
//                         user.transactions.unshift({
//                             title: `Fund transfer to ${receiver.fullname} #${receiver.number}`,
//                             amount: amount,
//                             type: "debit",
//                             date: getDateToday()
//                         });

//                         setSender(user);
//                         senderSuccess = true;
//                     }
//                 }
//             });

//             // add to receiver 
//             if (senderSuccess) {
//                 users.forEach(user => {
//                     if (user.number === receiver.number) {
//                         user.balance += amount;

//                         user.transactions.unshift({
//                             title: `Fund transfer from ${sender.fullname} #${receiver.number}`,
//                             amount: amount,
//                             type: "credit",
//                             date: getDateToday()
//                         });

//                         setReceiver(user);
//                     }
//                 });

//                 setNotif({ message: 'Successful transfer.', style: 'success' });
//                 setUsers(users);
//                 props.setUsers(users); // Sync updated users with the parent
//                 localStorage.setItem('users', JSON.stringify(users));
//                 setTransferAmount(0);
//             } else {
//                 setNotif({ message: 'Transfer failed.', style: 'danger' });
//             }
//         } else {
//             setNotif({ message: 'Incomplete information. Missing sender or receiver.', style: 'danger' });
//         }
//     }

//     const onTransfer = (e) => {
//         const transfer = parseFloat(e.target.value.replace(/,/g, '')) || 0;
//         setTransferAmount(transfer);
//     }

//     let senderField =
//         <select onChange={senderSelected} name="sender">
//             <option>Select Sender</option>
//             {senders}
//         </select>;

//     if (isClient) {
//         senderField = <input type="text" name="sender" value={`${client.fullname} #${client.number}`} disabled />
//     }

//     return (
//         <section id="main-content">
//             <form id="form" onSubmit={transferFund}>
//                 <h1>Fund Transfer</h1>
//                 <Notif message={notif.message} style={notif.style} />
//                 <h2>Sender</h2>
//                 <label>From (Sender)</label>
//                 {senderField}

//                 <label>Current balance</label>
//                 <input type="text" className="right" value={formatNumber(sender.balance)} disabled />

//                 <label>Amount to Transfer</label>
//                 <input type="text" name="amount" value={formatNumber(transferAmount)} onChange={onTransfer} autoComplete="off" className="right big-input" />

//                 <div className="transfer-icon"><i className='bx bx-down-arrow-alt'></i></div>
//                 <h2>Receiver</h2>
//                 <label>To (Receiver)</label>
//                 <select value={receiver.number || 0} onChange={receiverSelected} name="receiver">
//                     <option>Select Receiver</option>
//                     {newReceivers}
//                 </select>
//                 <label>Current balance</label>
//                 <input type="text" className="right" value={formatNumber(receiver.balance)} disabled />
//                 <input type="submit" className="btn" value="Transfer Fund" />
//             </form>
//         </section>
//     )
// }


// import { useState, useEffect } from "react";
// import { Notif } from "./Notif";
// import { formatNumber, getDateToday } from "./Utils";

// export const TransferPage = ({ isClient, client, users, setUsers }) => {
//     const [allUsers, setAllUsers] = useState(users || []); // Default to an empty array if undefined
//     const [receivers, setReceivers] = useState(users || []); // Default to an empty array if undefined
//     const [sender, setSender] = useState(isClient ? client : { balance: 0 });
//     const [receiver, setReceiver] = useState({ balance: 0 });
//     const [notif, setNotif] = useState({ message: 'Transfer money from one account to another.', style: 'left' });
//     const [transferAmount, setTransferAmount] = useState(0);

//     useEffect(() => {
//         if (users) {
//             setAllUsers(users);
//             setReceivers(users);
//         }
//     }, [users]);

//     const senderSelected = (event) => {
//         const accountNumber = event.target.value;

//         let sender = null;

//         users.forEach(user => {
//             if (user.number === accountNumber) {
//                 sender = user;
//             }
//         });

//         const newUsers = users.filter((user) => user.number !== accountNumber);

//         setSender(sender);
//         setReceivers(newUsers);
//         setReceiver({ balance: 0 });
//     };

//     const receiverSelected = event => {
//         const accountNumber = event.target.value;

//         let receiver = null;

//         users.forEach(user => {
//             if (user.number === accountNumber) {
//                 receiver = user;
//             }
//         });

//         setReceiver(receiver);
//     };

//     let senders = null;
//     if (!isClient) {
//         senders = users.map(user => {
//             return (
//                 <option value={user.number} key={user.number}>{user.fullname} #{user.number}</option>
//             );
//         });
//     }

//     const newReceivers = receivers && Array.isArray(receivers) ? receivers.map(receiver => {
//         if (sender.number !== receiver.number) {
//             return (
//                 <option value={receiver.number} key={receiver.number}>{receiver.fullname} #{receiver.number}</option>
//             );
//         }
//     }) : [];

//     const transferFund = event => {
//         event.preventDefault();
//         const amount = parseFloat(event.target.elements.amount.value.replace(/,/g, ''));
//         if (amount <= 0) return false;

//         if (sender.number !== 0 && receiver.number !== 0 && receiver.number) {
//             let senderSuccess = false;
//             users.forEach(user => {
//                 if (user.number === sender.number) {
//                     if (user.balance - amount >= 0) {
//                         user.balance -= amount;

//                         user.transactions.unshift({
//                             title: `Fund transfer to ${receiver.fullname} #${receiver.number}`,
//                             amount: amount,
//                             type: "debit",
//                             date: getDateToday()
//                         });

//                         setSender(user);
//                         senderSuccess = true;
//                     }
//                 }
//             });

//             if (senderSuccess) {
//                 users.forEach(user => {
//                     if (user.number === receiver.number) {
//                         user.balance += amount;

//                         user.transactions.unshift({
//                             title: `Fund transfer from ${sender.fullname} #${receiver.number}`,
//                             amount: amount,
//                             type: "credit",
//                             date: getDateToday()
//                         });

//                         setReceiver(user);
//                     }
//                 });

//                 setNotif({ message: 'Successful transfer.', style: 'success' });
//                 setAllUsers(users);
//                 setUsers(users); // Sync updated users with the parent
//                 localStorage.setItem('users', JSON.stringify(users));
//                 setTransferAmount(0);
//             } else {
//                 setNotif({ message: 'Transfer failed.', style: 'danger' });
//             }
//         } else {
//             setNotif({ message: 'Incomplete information. Missing sender or receiver.', style: 'danger' });
//         }
//     };

//     const onTransfer = (e) => {
//         const transfer = parseFloat(e.target.value.replace(/,/g, '')) || 0;
//         setTransferAmount(transfer);
//     };

//     let senderField =
//         <select onChange={senderSelected} name="sender">
//             <option>Select Sender</option>
//             {senders}
//         </select>;

//     if (isClient) {
//         senderField = <input type="text" name="sender" value={`${client.fullname} #${client.number}`} disabled />;
//     }

//     return (
//         <section id="main-content">
//             <form id="form" onSubmit={transferFund}>
//                 <h1>Fund Transfer</h1>
//                 <Notif message={notif.message} style={notif.style} />
//                 <h2>Sender</h2>
//                 <label>From (Sender)</label>
//                 {senderField}

//                 <label>Current balance</label>
//                 <input type="text" className="right" value={formatNumber(sender.balance)} disabled />

//                 <label>Amount to Transfer</label>
//                 <input type="text" name="amount" value={formatNumber(transferAmount)} onChange={onTransfer} autoComplete="off" className="right big-input" />

//                 <div className="transfer-icon"><i className='bx bx-down-arrow-alt'></i></div>
//                 <h2>Receiver</h2>
//                 <label>To (Receiver)</label>
//                 <select value={0} onChange={receiverSelected} name="receiver">
//                     <option>Select Receiver</option>
//                     {newReceivers}
//                 </select>
//                 <label>Current balance</label>
//                 <input type="text" className="right" value={formatNumber(receiver.balance)} disabled />
//                 <input type="submit" className="btn" value="Transfer Fund" />
//             </form>
//         </section>
//     );
// };


import { useState, useEffect } from "react";
import { Notif } from "./Notif";
import { formatNumber } from "./Utils";


export const TransferPage = ({ client, users, setUsers }) => {
    const [sender, setSender] = useState(client || { balance: 0 });
    const [receiver, setReceiver] = useState(null);
    const [transferAmount, setTransferAmount] = useState("");
    const [notif, setNotif] = useState({ message: 'Transfer funds between accounts.', style: 'left' });

    const handleReceiverSelect = (event) => {
        const selectedReceiver = users.find(user => user.number === parseInt(event.target.value));
        console.log('selectedReceiver', selectedReceiver)
        setReceiver(selectedReceiver || null);
    };

    const handleTransferAmountChange = (event) => {
        setTransferAmount(event.target.value);
    };

    const handleTransfer = async (event) => {
        event.preventDefault();
        const amount = parseFloat(transferAmount.replace(/,/g, ''));

        if (!receiver || amount <= 0) {
            setNotif({ message: 'Invalid details. Select a receiver and enter a positive amount.', style: 'danger' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/transfer-funds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderNumber: sender.number,
                    receiverNumber: receiver.number,  // Access receiver number directly
                    amount,
                }),
            });
            const result = await response.json();

            if (response.ok) {
                setNotif({ message: 'Transfer successful.', style: 'success' });
                setSender(result.sender);
                setReceiver(result.receiver);
                setUsers(users.map(user =>
                    user.number === sender.number ? result.sender :
                        user.number === receiver.number ? result.receiver : user
                ));
                setTransferAmount("");
            } else {
                setNotif({ message: result.message, style: 'danger' });
            }
        } catch (error) {
            setNotif({ message: 'Transfer failed. Please try again.', style: 'danger' });
        }
    };

    return (
        <section id="main-content">
            <form id="form" onSubmit={handleTransfer}>
                <h1>Fund Transfer</h1>
                <Notif message={notif.message} style={notif.style} />

                <h2>Sender</h2>
                <label>From (Sender)</label>
                <input type="text" name="sender" value={`${sender.fullname} #${sender.number}`} disabled />

                <label>Current Balance</label>
                <input type="text" value={formatNumber(sender.balance)} disabled />

                <label>Amount to Transfer</label>
                <input type="text" value={transferAmount} onChange={handleTransferAmountChange} autoComplete="off" />

                <h2>Receiver</h2>
                <label>To (Receiver)</label>
                <select onChange={handleReceiverSelect} value={receiver ? receiver.number : ""}>
                    <option value="">Select Receiver</option>
                    {users.filter(user => user.number !== sender.number).map(user => (
                        <option key={user.number} value={user.number}>{user.fullname} #{user.number}</option>
                    ))}
                </select>

                <input type="submit" value="Transfer Funds" />
            </form>
        </section>
    );
};
