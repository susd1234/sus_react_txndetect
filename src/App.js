import React, { Component } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Papa from "papaparse";

const apiPOSTEndpoint = process.env.REACT_APP_API_ENDPOINT_POST;
const apiGETEndpoint = process.env.REACT_APP_API_ENDPOINT_GET;

class App extends Component {
  state = {
    selectedFile: null,
    fileUploadedSuccessfully: false,
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  onFileUpload = () => {
    if (this.state.selectedFile) {
      const formData = new FormData();
      formData.append(
        "demo file",
        this.state.selectedFile,
        this.state.selectedFile.name
      );

      axios
        .post(apiPOSTEndpoint, formData)
        .then((response) => {
          // Handle the successful upload here
          this.setState({ selectedFile: null });
          this.setState({ fileUploadedSuccessfully: true });
        })
        .catch((error) => {
          // Handle the error here
          console.error("File upload error:", error);
        });
    }
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details: </h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModified
              ? new Date(this.state.selectedFile.lastModified).toDateString()
              : "N/A"}
          </p>
        </div>
      );
    } else if (this.state.fileUploadedSuccessfully) {
      return (
        <div>
          <br />
          <br />
          {/* <h4>File has been Successfully Validated by AI!!</h4> */}
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose the Txn File and then Press the Validate button</h4>
        </div>
      );
    }
  };

  FetchData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(apiGETEndpoint);
          const parsedData = Papa.parse(response.data, { header: true });

          setData(parsedData.data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }, []);

    return (
      <table>
        <thead>
          <tr>
            {data[0] &&
              Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {Object.values(row).map((val) => (
                <td key={val}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  render() {
    return (
      <div id="container">
        <h2>Please Upload the Transation File (.csv) for AI Validation</h2>
        <br />
        <br />
        <div id="upldbutton">
          <input type="file" onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>Validate</button>
          {this.state.fileUploadedSuccessfully && <FetchData />}
        </div>
        {this.fileData()}

        {/* <span>{this.FetchData()}</span> */}

        {/* FetchData(this.FetchData) */}
        {/* <FetchData /> */}
      </div>
    );
  }
}

export default App;

function FetchData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [content, setContent] = useState(null); // Content to be displayed

  useEffect(() => {
    // Simulate a 5-second wait
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 5 seconds
      // setContent("Content to display after 5 seconds");
      setContent("Txns have been Successfully Validated by AI !!");
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clear the timer when the component unmounts to avoid memory leaks
    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate a 5-second wait before making the request
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const response = await axios.get(apiGETEndpoint);
        const parsedData = Papa.parse(response.data, { header: true });

        setData(parsedData.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading... Please wait.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                {data[0] &&
                  Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  {Object.values(row).map((val) => (
                    <td key={val}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* {content} */}
          <span id="tbl">
            <br />
            <br />
            {content}
            <br />
            <br />
            {/* <h4>File has been Successfully Validated by AI!!</h4> */}
          </span>
        </div>
      )}
    </div>
  );
}
