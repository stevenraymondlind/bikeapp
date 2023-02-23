import { useState } from "react";

export function ReportDamage() {
  const [checked, setChecked] = useState({
    damaged: false,
    stolen: false,
    lost: false,
  });
  const [searchBikeId, setSearchBikeId] = useState("");
  const [damaged, setDamage] = useState(false); // const validate = damage =>{ //   const {damage} = damage // }
  const handleChange = (e) => {
    const { name } = e.target;
    setChecked({
      ...checked,
      [name]: !checked[name],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkedData = {
      damage: checked.damaged,
      lost: checked.lost,
      stolen: checked.stolen,
    }; ///FETCH POST /// TRUE FALSE POST .......if()...????
    try {
      const response = await fetch(`http://localhost:3333/bikesreport/${searchBikeId}`, {
        method: "PUT",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ damage: checkedData }),
      });
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(err);
    }
  };


  return (
   
      <div className="auth-form">
        <form onSubmit={handleSubmit} className="user-form">
          <ul className="list-damage">
            <li>
              <label htmlFor="bikeid" className="label">Bike Id:</label>
              <input type="text" value={searchBikeId} onChange={(e) => setSearchBikeId(e.target.value)} />
              </li>
              <li>
              <label htmlFor="damage" className="label">
                Damaged:
              </label>
              <input
                name="damaged"
                id="damaged"
                type="checkbox"
                checked={checked.damaged}
                onChange={handleChange}
              />
            </li>
            <li>
              <label htmlFor="lost" className="label">
                Lost:
              </label>

              <input
                name="lost"
                type="checkbox"
                id="lost"
                checked={checked.lost}
                onChange={handleChange}
              />
            </li>
            <li>
              <label htmlFor="lost">Stolen: </label>
              <input
                name="stolen"
                id="stolen"
                type="checkbox"
                checked={checked.stolen}
                onChange={handleChange}
              />
            </li>
    
          </ul>
          <button className="buttonReportDamage" type="submit">SUBMIT</button>
        </form>
    </div>
  );
}
