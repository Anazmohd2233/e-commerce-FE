import React, { useEffect, useState } from "react";
import home from "@/utility/header/home";
import classic from "@/utility/header/classic";
import banner from "@/utility/header/benner";
import column from "@/utility/header/columns";
import list from "@/utility/header/list";
import blog from "@/utility/header/blog";
import pages from "@/utility/header/pages";
import fruits from "@/utility/header/fruits";
import bakery from "@/utility/header/bakery";
import snacks from "@/utility/header/snacks";
import spice from "@/utility/header/spice";
import juice from "@/utility/header/juice";
import softdrink from "@/utility/header/softdrink";
import { Link } from "react-router-dom";
import productpage from "@/utility/header/productpage";
import CurrentLocation from "./CurrentLocation";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Fade } from "react-awesome-reveal";
import { useCategory } from "@/hooks/useCategory";

function HeaderManu() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleProductClick = (index: number) => {
    setSelectedIndex(index);
  };

  const {
    categories,
    subCategories,
    getCategories,
    getSubCategories,
    loading,
  } = useCategory();

  useEffect(() => {
      console.log("Dispatching fetchCategories & fetchSubCategories...");

    getCategories(1);
    getSubCategories(1);
  }, [getCategories, getSubCategories]);

  return (
    <>
      <div className="gi-header-cat d-none d-lg-block">
        <div className="container position-relative">
          <div className="gi-nav-bar">
           <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex} className="gi-category-icon-block">
            <div className="gi-category-menu">
              <div className="gi-category-toggle">
                <i className="fi fi-rr-apps"></i>
                <span className="text">All Categories</span>
                <i className="fi-rr-angle-small-down d-1199 gi-angle" aria-hidden="true"></i>
              </div>
            </div>

            <div className="gi-cat-dropdown">
              <div className="gi-cat-block">
                <div className="gi-cat-tab">
                  <TabList>
                    <div className="gi-tab-list nav flex-column nav-pills me-3" role="tablist" aria-orientation="vertical">
                      {categories?.map((cat: any, index: number) => (
                        <Tab key={cat.id}>
                          <button
                            className={`nav-link ${selectedIndex === index ? "active" : ""}`}
                            onClick={() => handleProductClick(index)}
                            type="button"
                            role="tab"
                            style={{ padding: "10px 22px", marginBottom: "10px" }}
                          >
                            <i className="fi fi-rr-folder"></i> {cat.name}
                          </button>
                        </Tab>
                      ))}
                    </div>
                  </TabList>

                  <div className="tab-content">
                    {categories?.map((cat: any, index: number) => (
                      <Fade duration={500} delay={200} key={cat.id}>
                        <TabPanel
                          className={`tab-pane fade ${selectedIndex === index ? "show active product-block" : ""}`}
                          role="tabpanel"
                        >
                          <div className="tab-list row">
                            {subCategories
                              ?.filter((sub: any) => sub?.category_id?.id === cat.id) 
                              .map((sub: any) => (
                                <div className="col" key={sub.id}>
                                  {/* <h6 className="gi-col-title">{sub.name}</h6> */}
                                  <ul className="cat-list">
                                    <li>
                                      <Link  to={`/subcategory/${sub.id}`}>{sub.name}</Link>
                                    </li>
                                  </ul>
                                </div>
                              ))}
                          </div>
                        </TabPanel>
                      </Fade>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Tabs>

            {/* <!-- Main Menu Start --> */}
            <div
              id="gi-main-menu-desk"
              className="d-none d-lg-block sticky-nav"
            >
              <div className="nav-desk">
                <div className="row">
                  <div className="col-md-12 align-self-center">
                    <div className="gi-main-menu">
                      <ul>
                        <li className="dropdown drop-list">
                          <Link to="/" className="dropdown-arrow">
                            Home
                            {/* <i className="fi-rr-angle-small-right"></i> */}
                          </Link>
                          {/* <ul className="sub-menu">
                            {home.map((data, index) => (
                              <li key={index}>
                                <Link to={data.href}>{data.name}</Link>
                              </li>
                            ))}
                          </ul> */}
                        </li>


{/* 
                        <li className="dropdown drop-list position-static">
                          <Link to="#" className="dropdown-arrow">
                            Categories
                            <i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="mega-menu d-block">
                            <li className="d-flex">
                              <span className="bg"></span>
                              <ul className="d-block mega-block">
                                <li className="menu_title">
                                  <Link to="/">Classic</Link>
                                </li>
                                {classic.map((data, index) => (
                                  <li key={index}>
                                    <Link to={data.href}>{data.name}</Link>
                                  </li>
                                ))}
                              </ul>
                              <ul className="d-block mega-block">
                                <li className="menu_title">
                                  <Link to="#">Banner</Link>
                                </li>
                                {banner.map((data, index) => (
                                  <li key={index}>
                                    <Link to={data.href}>{data.name}</Link>
                                  </li>
                                ))}
                              </ul>


                              
                              <ul className="d-block mega-block">
                                <li className="menu_title">
                                  <Link to="#">Columns</Link>
                                </li>
                                {column.map((data, index) => (
                                  <li key={index}>
                                    <Link to={data.href}>{data.name}</Link>
                                  </li>
                                ))}
                              </ul>
                              <ul className="d-block mega-block">
                                <li className="menu_title">
                                  <Link to="#">List</Link>
                                </li>
                                {list.map((data, index) => (
                                  <li key={index}>
                                    <Link to={data.href}>{data.name}</Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          </ul>
                        </li> */}
                        <li className="dropdown drop-list">
                          <Link to="shop-full-width-col-4" className="dropdown-arrow">
                            Products
                          </Link>
                          {/* <ul className="sub-menu">
                            {productpage.map((data, index) => (
                              <li
                                key={index}
                                className="dropdown position-static"
                              >
                                <Link to="#">
                                  {data.name}
                                  <i className="fi-rr-angle-small-right"></i>
                                </Link>
                                <ul className="sub-menu sub-menu-child">
                                  {data.subname &&
                                    data.subname.map((subPage, subIndex) => (
                                      <React.Fragment key={subIndex}>
                                        <li>
                                          <Link to={subPage.href}>
                                            {subPage.name}
                                          </Link>
                                        </li>
                                      </React.Fragment>
                                    ))}
                                </ul>
                              </li>
                            ))}
                            <li>
                              <Link to={`/product-full-width`}>
                                Product full width
                              </Link>
                            </li>
                            <li>
                              <Link to={`/product-according-full-width`}>
                                accordion full width
                              </Link>
                            </li>
                          </ul> */}
                        </li>
                        {/* <li className="dropdown drop-list">
                          <Link to="#" className="dropdown-arrow">
                            Blog<i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="sub-menu">
                            {blog.map((data, index) => (
                              <li key={index}>
                                <Link to={data.href}>{data.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </li> */}
                        {/* <li className="dropdown drop-list">
                          <Link to="#" className="dropdown-arrow">
                            Pages<i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="sub-menu">
                            {pages.map((data, index) => (
                              <li key={index}>
                                <Link to={data.href}>{data.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </li> */}

                        <li className="non-drop">
                          <Link to="/cart">
                            <i className="fi-rr-badge-percent"></i>Cart
                          </Link>
                        </li>
                        {/* <li className="non-drop">
                          <Link to="/banner-left-sidebar-col-3">
                            <i className="fi-rr-badge-percent"></i>Offers
                          </Link>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Main Menu End --> */}

            {/* <CurrentLocation /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderManu;
