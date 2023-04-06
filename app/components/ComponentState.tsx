type StateProps = {
  error: any;
  isLoading: boolean;
};

export default function ComponentState({ error, isLoading }: StateProps) {
  if (error)
    return (
      <div className="flex justify-center items-center h-100">
        <h1>Error has occured while fetching data</h1>
      </div>
    );
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-100">
        <h1>Loading...</h1>
      </div>
    );
  return <span></span>;
}
