import { useEffect, useState } from "react";
import style from "../styles/items.module.scss";
import { api } from "../utils/rest";

export default function Items() {
  const [status, setStatus] = useState("Loading items...");
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getItems()
      .then((data) => {
        const list = data?.items ?? [];
        setItems(list);
        setCount(data?.count ?? list.length);
        setStatus("OK");
      })
      .catch((e) => {
        setError(e.message || "Failed to load items");
        setStatus("Error");
      });
  }, []);

  return (
    <div className={style.page}>
      <div className={style.container}>
        <header className={style.header}>
          <h1 className={style.title}>Items (FastAPI)</h1>
          <p className={style.subtle}>
            Status: {status} {error && <span className={style.error}>— {error}</span>}
          </p>
        </header>

        {/* Summary metric */}
        <section className={style.section}>
          <div className={style.metricsGrid}>
            <div className={style.metricCard}>
              <p className={style.metricLabel}>Total Items</p>
              <p className={style.metricValue}>{count}</p>
            </div>
          </div>
        </section>

        {/* Item cards */}
        <section className={style.section}>
          <div className={style.grid}>
            {items.map((item) => (
              <div key={item.id} className={style.itemCard}>
                <div className={style.itemHeader}>
                  <h2 className={style.itemName}>{item.name}</h2>
                  <span className={`${style.badge} ${item.in_stock ? style.badgeIn : style.badgeOut}`}>
                    {item.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className={style.itemMeta}>ID: {item.id}</div>
                <div className={style.price}>${item.price}</div>
              </div>
            ))}
          </div>

          {items.length === 0 && !error && (
            <p className={style.subtle}>No items to display.</p>
          )}
        </section>
      </div>
    </div>
  );
}