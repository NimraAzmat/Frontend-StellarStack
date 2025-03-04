import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
require('dotenv').config();
const Home = () => {
  const [jobs, setJobs] = useState([]);
  console.log(process.env.BASE_URL)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs`);
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="container">
      <h2>Job Listings</h2>
      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>
              <h3>{job.title}</h3>
              <p>{job.company} - {job.location}</p>
              <Link href={`/job/${job._id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
