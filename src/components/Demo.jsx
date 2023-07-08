import React, { useEffect, useState } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const [copyy, setCopyy] = useState("");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      setArticle(newArticle);
      const updatedAllArticles = [newArticle, ...allArticles];
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopyy(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => {
      setCopyy("");
    }, 3000);
  };

  return (
    <section className="mt-16 w-full  max-w-full">
      <div className="gap-2 flex flex-col w-full">
        <form
          className=" relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link"
            className="absolute left-0 w-5 my-2 ml-3"
          />
          <input
            type="url"
            placeholder="Enter A URL"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn text-xl font-extrabold peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <p className="text-xl">↵</p>
          </button>
        </form>

        {allArticles.length > 0 && (
          <h2 className="font-satoshi font-bold text-gray-600 mt-5 text-xl">
            Search <span className="blue_gradient"> History</span>
          </h2>
        )}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              className="link_card"
              key={`link-${index}`}
              onClick={() => {
                setArticle(item);
              }}
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copyy === item.url ? tick : copy}
                  alt="copy"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 flex items-center max-w-full justify-center">
        {isFetching ? (
          <img
            src={loader}
            alt="loading"
            className="w-20 h-20 object-contain"
          />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that was not supposed to happen... <br />{" "}
            <span className="font-satoshi font-bold text-red-700">
              {error?.data?.error}
            </span>{" "}
            <wan></wan>
          </p>
        ) : (
          article.summary && (
            <div className="flex-col flex gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient"> Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-xl text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
