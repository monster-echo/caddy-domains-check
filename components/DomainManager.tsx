"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, ShieldCheck, ShieldAlert } from "lucide-react";

export function DomainManager() {
  const [domains, setDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchDomains = async () => {
    try {
      const res = await fetch("/api/caddy/list");
      const data = await res.json();
      setDomains(data.prefixes || []);
    } catch (error) {
      console.error("Failed to fetch domains", error);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAdd = async () => {
    if (!newDomain) return;
    if (!token) {
      setMessage({ type: "error", text: "Admin token is required" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/caddy/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prefix: newDomain }),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: `Added ${newDomain} successfully`,
        });
        setNewDomain("");
        fetchDomains();
      } else {
        const text = await res.text();
        setMessage({ type: "error", text: `Failed: ${text}` });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Domain Management</CardTitle>
          <CardDescription>
            Manage allowed domain prefixes for Caddy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Admin Token</label>
            <Input
              type="password"
              placeholder="Enter admin token..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder="New prefix (e.g. blog)"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
            />
            <Button onClick={handleAdd} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          {message && (
            <div
              className={`p-2 rounded text-sm flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
              }`}
            >
              {message.type === "success" ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <ShieldAlert className="h-4 w-4" />
              )}
              {message.text}
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Allowed Prefixes</h4>
            <div className="bg-muted p-2 rounded-md max-h-60 overflow-y-auto">
              {domains.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No domains found.
                </p>
              ) : (
                <ul className="space-y-1">
                  {domains.map((d) => (
                    <li
                      key={d}
                      className="text-sm px-2 py-1 bg-background rounded shadow-sm flex justify-between items-center"
                    >
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
