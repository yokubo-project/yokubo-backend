import * as _ from "lodash";
import * as traverse from "traverse";

/* Get rid of circular references and replace values matched by key with a placeholder */
export function purify(body: Object, keys: string[]): Object {

    let transformedBody = _.cloneDeep(body);

    traverse(transformedBody).forEach(function (value) {

        // scrub circular references
        if (this.circular) {
            this.remove();
        }

        // replace values
        if (keys.find(key => key === this.key)) {
            return `__PLACEHOLDER_FOR_${this.key}__`;
        }

        return value;
    });

    return transformedBody;

}
