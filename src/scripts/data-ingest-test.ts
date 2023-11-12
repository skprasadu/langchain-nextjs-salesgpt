import { llm } from "../controllers/llm";
import { setup_knowledge_base } from "../knowledge/data_ingest";

export async function setup_knowledge_base_test(query: string) {
    const knowledge_base = await setup_knowledge_base(
      "sample_product_catalog.txt",
      llm
    );
    const response = await knowledge_base.call({ query });
    console.log(response);
  }
  setup_knowledge_base_test("What products do you have available?");