import "./App.css";
<dd>Trader-ready lots</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="intro band">
          <div className="section-head">
            <p className="eyebrow">Why Mandsaur Garlic</p>
            <h2>Hindi + English B2B communication, simple buying process.</h2>
          </div>
          <div className="intro-grid">
            <article>
              <span className="mini-icon" aria-hidden="true"></span>
              <h3>Direct Mandi Sourcing</h3>
              <p>Mandsaur mandi se fresh garlic sourcing, daily availability aur rate discussion.</p>
            </article>
            <article>
              <span className="mini-icon" aria-hidden="true"></span>
              <h3>Bulk Buyer Focus</h3>
              <p>Traders, wholesalers, exporters, processors, hotels aur food brands ke liye lots.</p>
            </article>
            <article>
              <span className="mini-icon" aria-hidden="true"></span>
              <h3>Dispatch Support</h3>
              <p>Packaging, loading, transport coordination aur buyer location ke hisab se planning.</p>
            </article>
          </div>
        </section>

        <section id="products" className="products">
          <div className="section-head">
            <p className="eyebrow">Products | Product</p>
            <h2>Garlic lots for wholesale and commercial buying.</h2>
          </div>
          <div className="product-grid">
            <article className="product-card">
              <p className="tag">Fresh Garlic</p>
              <h3>Whole Garlic Bulbs</h3>
              <p>Clean, dry, market-ready garlic bulbs for traders and retailers.</p>
              <span>Size: Small / Medium / Large</span>
            </article>
            <article className="product-card">
              <p className="tag">Sorted Lots</p>
              <h3>Graded Garlic</h3>
              <p>Buyer requirement ke according size sorting and quality separation.</p>
              <span>Use: Exporters, processors, wholesalers</span>
            </article>
            <article className="product-card">
              <p className="tag">Packing</p>
              <h3>Jute & Net Bags</h3>
              <p>Bulk packing options for transport, storage and mandi trade.</p>
              <span>Options: 10kg, 20kg, 25kg, 50kg</span>
            </article>
          </div>
        </section>

        <section id="process" className="process band">
          <div className="section-head">
            <p className="eyebrow">Buying Process | Kharid Prakriya</p>
            <h2>Inquiry se dispatch tak clear B2B workflow.</h2>
          </div>
          <ol className="steps">
            <li>
              <strong>1. Requirement Share Karein</strong>
              <span>Quantity, size, packing, delivery city aur buyer type WhatsApp par bhejein.</span>
            </li>
            <li>
              <strong>2. Rate & Quality Confirm</strong>
              <span>Current mandi rate, available lot, photos/video and packing details share honge.</span>
            </li>
            <li>
              <strong>3. Loading & Dispatch</strong>
              <span>Payment terms, transport and loading schedule final karke maal dispatch hoga.</span>
            </li>
          </ol>
        </section>

        <section id="enquiry" className="enquiry">
          <div className="enquiry-copy">
            <p className="eyebrow">WhatsApp Pe Baat Karo Format</p>
            <h2>Send a clean B2B garlic enquiry in one tap.</h2>
            <p>
              Form bharte hi WhatsApp message ready ho jayega. Isse rate, availability,
              packing aur dispatch details jaldi confirm ho sakte hain.
            </p>
            <div className="contact-strip">
              <strong>mandsaurgarlic.com</strong>
              <span>Wholesale | Export | Processing | Trading</span>
            </div>
          </div>

          <form className="enquiry-form" onSubmit={handleEnquirySubmit}>
            <label>
              Buyer Type
              <select name="buyerType" required defaultValue="Wholesaler / Trader">
                <option value="Wholesaler / Trader">Wholesaler / Trader</option>
                <option value="Exporter">Exporter</option>
                <option value="Food Processor">Food Processor</option>
                <option value="Hotel / Restaurant Supplier">Hotel / Restaurant Supplier</option>
                <option value="Retail Chain">Retail Chain</option>
              </select>
            </label>

            <label>
              Required Quantity
              <input name="quantity" type="text" placeholder="Example: 5 ton / 200 bags" required />
            </label>

            <label>
              Garlic Requirement
              <select name="requirement" required defaultValue="Fresh whole garlic">
                <option value="Fresh whole garlic">Fresh whole garlic</option>
                <option value="Graded garlic">Graded garlic</option>
                <option value="Large size garlic">Large size garlic</option>
                <option value="Medium size garlic">Medium size garlic</option>
                <option value="Custom packing garlic">Custom packing garlic</option>
              </select>
            </label>

            <label>
              Delivery Location
              <input name="location" type="text" placeholder="City, State / Port" required />
            </label>

            <label>
              Name / Company
              <input name="name" type="text" placeholder="Your name or company" />
            </label>

            <button className="btn primary full" type="submit">
              <WhatsAppIcon />
              Open WhatsApp Enquiry
            </button>
            <p className="form-note">WhatsApp number connected: +91 7772993222</p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 Mandsaur Garlic. B2B garlic wholesale and sourcing.</p>
        <a className="footer-whatsapp" href={openDefaultWhatsapp} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          WhatsApp Pe Baat Karo
        </a>
      </footer>

      <a className="floating-whatsapp" href={openDefaultWhatsapp} target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp enquiry">
        <WhatsAppIcon />
        <strong>WhatsApp</strong>
      </a>
    </>
  );
}
