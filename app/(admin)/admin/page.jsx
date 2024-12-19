"use client";
import { useEffect, useState } from "react";
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import { useAlert } from "@/components/alert-context";
import { fetchUtils } from "react-admin";
import Loader from "@/components/Loader";
export default function adminPage() {
  const { showAlert } = useAlert();
  const apiUrl = "/api/";

  const httpClient = async (url, options = {}) => {
    // let data;
    // async function fetchData() {
    //   try {
    //     const res = await fetch(url);
    //     if (!res.ok)
    //       throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    //     data = await res.json();
    //   } catch (error) {
    //     showAlert({
    //       message: error.message,
    //       severity: "error",
    //     });
    //   } finally {
    //     return data;
    //   }
    // }
    // return fetchData();
    options.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace token logic as per your auth mechanism
    });

    try {
      const response = await fetchUtils.fetchJson(url, options);
      return response;
    } catch (error) {
      showAlert({
        message: `HTTP Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  const getIdentifier = function (param) {
    if (param == "course") return param.course_code;
    if (param == "users") return param.user_id;
  };

  const dataProvider = {
    getList: async (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        _sort: field,
        _order: order,
        _page: page,
        _limit: perPage,
        ...params.filter, // Include additional filters
      };
      const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
      const { json } = await httpClient(url);

      const updatedJson = json.map((obj) => {
        const { user_id, ...rest } = obj; // Destructure to exclude user_id
        return { ...rest, id: user_id }; // Add "id" with the value of "user_id"
      });

      console.log(json);
      return {
        // data: json.map((user) => ({
        //   ...user,
        //   id: user.user_id, // Map user_id to id
        // })),

        data: updatedJson,
        total: parseInt(updatedJson.length, 10),
      };
    },
    getOne: async (resource, params) => {
      const identifier = getIdentifier(params);
      console.log(params.id);
      const url = `${apiUrl}/${resource}/${params.id}`;
      const { json } = await httpClient(url);

      return { data: json };
    },
    getMany: async (resource, params) => {
      const query = {
        id: params.ids,
      };
      const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
      const { json } = await httpClient(url);

      return {
        data: json.map((user) => ({
          ...user,
          id: user.user_id,
        })),
      };
    },
    create: async (resource, params) => {
      const url = `${apiUrl}/${resource}`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(params.data), // Data to create
      });
      return { data: { ...params.data, id: json.id } }; // Return the new record with ID
    },

    // Update an existing resource
    update: async (resource, params) => {
      const url = `${apiUrl}/${resource}/${params.id}`;
      const { json } = await httpClient(url, {
        method: "PUT",
        body: JSON.stringify(params.data), // Data to update
      });
      return { data: json };
    },

    // Delete a resource by ID
    delete: async (resource, params) => {
      const url = `${apiUrl}/${resource}/${params.id}`;
      const { json } = await httpClient(url, {
        method: "DELETE",
      });
      return { data: json };
    },

    // Delete multiple resources by IDs
    deleteMany: async (resource, params) => {
      const query = {
        id: params.ids,
      };
      const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
      await httpClient(url, {
        method: "DELETE",
      });
      return { data: params.ids }; // Return deleted IDs
    },
  };

  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="users"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="users"
      />
      <Resource
        name="courses"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="courses"
      />
      <Resource
        name="projects"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="projects"
      />
    </Admin>
  );
}
