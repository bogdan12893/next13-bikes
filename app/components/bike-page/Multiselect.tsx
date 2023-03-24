"use client";
import { Listbox } from "@headlessui/react";

export default function Multiselect({ options, selectedOptions, onChange }) {
  return (
    <Listbox value={selectedOptions} onChange={onChange} multiple>
      <div className="relative mt-1">
        <Listbox.Button>
          {selectedOptions.map((item: any) => item.name).join(', ')}
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-teal-600 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options?.map((option: any) => (
            <Listbox.Option
              key={option.id}
              value={option}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                  active ? "bg-teal-400 text-black-900" : "text-gray-900"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {option.name}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      ✅
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
