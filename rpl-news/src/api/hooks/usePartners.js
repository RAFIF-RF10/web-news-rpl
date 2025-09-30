import { useState, useEffect, useCallback } from "react";
import axiosClient from "../axiosClient";

const usePartners = () => {
  const [partnerData, setPartnerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch function
  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ganti endpoint sesuai backend kamu
      const res = await axiosClient.get("/partners");

      setPartnerData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  return { partnerData, loading, error, refetch: fetchPartners };
};

export default usePartners;
